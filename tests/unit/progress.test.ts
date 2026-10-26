import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProgressStore } from "../../src/persistence/store";
import { progressSchema, exportSchema } from "../../src/domain/progress";
import {
  migrateProgress,
  emptyProgress,
  codeFingerprint,
} from "../../src/learning/progress.js";
import {
  lessonEvidence,
  type LessonSummary,
} from "../../src/features/progress/evidence";
const stores: ProgressStore[] = [];
const create = () => {
  const store = new ProgressStore(localStorage);
  stores.push(store);
  return store;
};
beforeEach(async () => {
  localStorage.clear();
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase("sprout-progress-v3");
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
});
afterEach(() => {
  stores.forEach((store) => store.close());
  stores.length = 0;
});
it("salvages valid nested legacy values and preserves the original draft/checklist identity", () => {
  const original = {
    completed: ["js-welcome"],
    drafts: { good: "console.log(1)", bad: 42 },
    projects: { greeting: { 0: true, 1: "bad" } },
    practice: { bad: { cases: "bad" }, valid: { passed: true, revision: 2 } },
    activity: { today: 10, bad: "ten" },
    knowledge: { x: { passed: "yes" } },
    reflections: { x: [] },
  };
  const result = migrateProgress(original);
  expect(result.drafts).toEqual({ good: "console.log(1)" });
  expect(result.projects).toEqual({ greeting: { 0: true } });
  expect(result.practice).toEqual({ valid: { passed: true, revision: 2 } });
  expect(result.activity).toEqual({ today: 10 });
  expect(progressSchema.safeParse(result).success).toBe(true);
});
it("validates export structure and refuses malformed nested evidence", () => {
  expect(
    exportSchema.safeParse({
      format: "sprout-progress",
      version: 3,
      exportedAt: new Date().toISOString(),
      progress: {
        ...emptyProgress(),
        practice: { x: { cases: [{ label: "case", passed: "yes" }] } },
      },
    }).success,
  ).toBe(false);
});
it("merges simultaneous drafts in different tabs without losing either", async () => {
  const a = create(),
    b = create();
  await Promise.all([a.flush(), b.flush()]);
  a.saveDraft("one", "A");
  b.saveDraft("two", "B");
  await Promise.all([a.flush(), b.flush()]);
  const reader = create();
  await reader.flush();
  expect(reader.getSnapshot().drafts).toMatchObject({ one: "A", two: "B" });
});
it("retains both versions when two tabs edit the same draft", async () => {
  const a = create(),
    b = create();
  await Promise.all([a.flush(), b.flush()]);
  a.saveDraft("same", "first");
  b.saveDraft("same", "second");
  await Promise.all([a.flush(), b.flush()]);
  const reader = create();
  await reader.flush();
  expect(reader.getConflicts()).toHaveLength(1);
  const conflict = reader.getConflicts()[0];
  expect([conflict.local, conflict.other].sort()).toEqual(["first", "second"]);
  await reader.resolveConflict(conflict.id, "local");
  expect(reader.getDraft("same")).toBe(conflict.local);
  expect(reader.getConflicts()).toHaveLength(0);
});
it("replays a synchronous recovery journal after an immediate reload", async () => {
  const a = create();
  await a.flush();
  a.saveDraft("fast", "latest keystroke");
  a.checkpoint();
  const b = create();
  await b.flush();
  expect(b.getDraft("fast")).toBe("latest keystroke");
});
it("import merges completions, keeps existing code, and retains an alternate imported draft", async () => {
  const a = create();
  await a.flush();
  a.saveDraft("same", "existing");
  await a.flush();
  const data = await a.exportData();
  data.progress.drafts.same = "imported";
  data.progress.completed = ["js-welcome"];
  await a.importData(data);
  await a.flush();
  await new Promise((resolve) => setTimeout(resolve, 20));
  expect(a.getDraft("same")).toBe("existing");
  expect(a.getSnapshot().completed).toContain("js-welcome");
  expect(a.getConflicts()[0]?.local).toBe("imported");
});
it("selective reset preserves completions and checklists; old tabs cannot resurrect deleted data", async () => {
  const a = create(),
    b = create();
  await Promise.all([a.flush(), b.flush()]);
  a.update((p) => ({
    ...p,
    completed: ["js-welcome"],
    projects: { greeting: { 0: true } },
  }));
  a.saveDraft("x", "draft");
  await a.flush();
  await a.reset("drafts");
  expect(a.getSnapshot().completed).toEqual(["js-welcome"]);
  expect(a.getSnapshot().projects.greeting[0]).toBe(true);
  b.saveDraft("late", "stale tab");
  await a.reset("all");
  await b.flush();
  const reader = create();
  await reader.flush();
  expect(reader.getSnapshot().completed).toEqual([]);
  expect(reader.getSnapshot().drafts).toEqual({});
});
it("typing notifies only that editor, without rerendering progress subscribers", async () => {
  const a = create();
  await a.flush();
  let root = 0,
    draft = 0;
  a.subscribe(() => root++);
  a.subscribeDraft("x", () => draft++);
  a.saveDraft("x", "a");
  a.saveDraft("x", "ab");
  await a.flush();
  expect(root).toBe(0);
  expect(draft).toBeGreaterThan(0);
});
describe("evidence", () => {
  it("keeps completion and marks a changed task as stale", () => {
    const lesson: LessonSummary = {
      id: "test",
      title: "Test",
      courseId: "js",
      courseTitle: "JS",
      minutes: 10,
      teaching: {
        independent: {
          revision: 2,
          signature: "new",
          starterFingerprint: codeFingerprint("code"),
        },
      },
    };
    const progress = progressSchema.parse({
      ...emptyProgress(),
      completed: ["test"],
      practice: {
        "exercise-test-independent": {
          passed: true,
          revision: 2,
          signature: "old",
          fingerprint: codeFingerprint("code"),
        },
      },
    });
    expect(lessonEvidence(progress, lesson)).toMatchObject({
      completed: true,
      current: false,
      stale: true,
    });
  });
});
it("keeps simultaneous reflection versions and assisted evidence", async () => {
  const a = create(),
    b = create();
  await Promise.all([a.flush(), b.flush()]);
  a.update((p) => ({
    ...p,
    reflections: { lesson: "first explanation" },
    practice: { task: { assisted: true } },
  }));
  b.update((p) => ({
    ...p,
    reflections: { lesson: "second explanation" },
    practice: { task: { passed: true, checkedAt: new Date().toISOString() } },
  }));
  await Promise.all([a.flush(), b.flush()]);
  const reader = create();
  await reader.flush();
  expect(reader.getConflicts()[0]?.field).toBe("reflections");
  expect(reader.getSnapshot().practice.task).toMatchObject({
    passed: true,
    assisted: true,
  });
});
it("merges estimated activity once per newly completed lesson across tabs", async () => {
  const a = create(),
    b = create();
  await Promise.all([a.flush(), b.flush()]);
  const finish = (store: ProgressStore, id: string, minutes: number) =>
    store.update((p) => ({
      ...p,
      completed: [...p.completed, id],
      activity: { ...p.activity, "2026-10-20": minutes },
      history: [
        ...(p.history || []),
        {
          id: crypto.randomUUID(),
          at: new Date().toISOString(),
          kind: "completion",
          subject: id,
          day: "2026-10-20",
          estimatedMinutes: minutes,
        },
      ],
    }));
  finish(a, "one", 15);
  finish(b, "two", 18);
  await Promise.all([a.flush(), b.flush()]);
  const reader = create();
  await reader.flush();
  expect(reader.getSnapshot().activity["2026-10-20"]).toBe(33);
});
it("invalidates a knowledge check when its question changes", () => {
  const lesson: LessonSummary = {
    id: "test",
    title: "Test",
    courseId: "js",
    courseTitle: "JS",
    minutes: 10,
    knowledgeSignature: "new-question",
    teaching: {
      independent: {
        revision: 2,
        signature: "task",
        starterFingerprint: "code",
      },
    },
  };
  const progress = progressSchema.parse({
    ...emptyProgress(),
    knowledge: {
      test: { passed: true, revision: 2, signature: "old-question" },
    },
  });
  expect(lessonEvidence(progress, lesson).knowledge).toBe(false);
});
it("task instructions participate in stale-evidence detection", async () => {
  const { taskSignature, taskIsCurrent } =
    await import("../../src/learning/progress.js");
  const task = {
    revision: 2,
    goal: "Print Tea",
    instructions: "Print Tea",
    starter: "",
    checks: [],
  };
  const record = {
    passed: true,
    revision: 2,
    fingerprint: codeFingerprint("code"),
    signature: taskSignature(task),
  };
  expect(taskIsCurrent(record, task, "code")).toBe(true);
  expect(
    taskIsCurrent(record, { ...task, instructions: "Print Coffee" }, "code"),
  ).toBe(false);
});
it("exports and reimports unresolved alternative versions", async () => {
  const a = create(),
    b = create();
  await Promise.all([a.flush(), b.flush()]);
  a.saveDraft("same", "first");
  b.saveDraft("same", "second");
  await Promise.all([a.flush(), b.flush()]);
  const reader = create();
  await reader.flush();
  const exported = await reader.exportData();
  expect(exported.conflicts).toHaveLength(1);
  await reader.reset("all");
  await reader.importData(exported);
  await reader.flush();
  await new Promise((resolve) => setTimeout(resolve, 20));
  expect(reader.getConflicts()).toHaveLength(1);
  expect(reader.getConflicts()[0].local).toBe(exported.conflicts![0].local);
});
it("restores a valid export after corrupt legacy JSON and prefers a valid canonical save", async () => {
  const raw = '{"drafts":';
  localStorage.setItem("sprout-learning-v1", raw);
  const a = create();
  await a.flush();
  expect(a.getStatus()).toBe("recovery");
  await a.importData({
    format: "sprout-progress",
    version: 3,
    exportedAt: new Date().toISOString(),
    progress: {
      ...emptyProgress(),
      name: "Recovered",
      dailyGoal: 30,
      drafts: { kept: "restored" },
    },
  });
  expect(a.getStatus()).toBe("saved");
  expect(a.getDraft("kept")).toBe("restored");
  expect(localStorage.getItem("sprout-learning-v1")).toBe(raw);
  const b = create();
  await b.flush();
  expect(b.getSnapshot().name).toBe("Recovered");
  expect(b.getSnapshot().dailyGoal).toBe(30);
  expect(b.getDraft("kept")).toBe("restored");
});
it("concurrent failed writes retain pending work and can be retried", async () => {
  const a = create();
  await a.flush();
  a.saveDraft("retry", "kept during failure");
  const broken = vi
    .spyOn(IDBDatabase.prototype, "transaction")
    .mockImplementation(() => {
      throw new DOMException("No space", "QuotaExceededError");
    });
  await Promise.all([a.flush(), a.flush()]);
  expect(a.getStatus()).toBe("error");
  broken.mockRestore();
  await a.flush();
  expect(a.getStatus()).toBe("saved");
  const reader = create();
  await reader.flush();
  expect(reader.getDraft("retry")).toBe("kept during failure");
});
it("resolving an old conflict cannot overwrite a newer third version", async () => {
  const a = create(),
    b = create();
  await Promise.all([a.flush(), b.flush()]);
  a.saveDraft("same", "one");
  b.saveDraft("same", "two");
  await Promise.all([a.flush(), b.flush()]);
  const reader = create();
  await reader.flush();
  const old = reader.getConflicts()[0];
  reader.saveDraft("same", "newer third version");
  await reader.flush();
  expect(await reader.resolveConflict(old.id, "local")).toBe(false);
  expect(reader.getDraft("same")).toBe("newer third version");
  const updated = reader.getConflicts()[0];
  expect(updated.local).toBe(old.local);
  expect(updated.other).toBe("newer third version");
  expect(await reader.resolveConflict(updated.id, "local")).toBe(true);
  expect(reader.getDraft("same")).toBe(old.local);
});
it("salvages valid legacy records when one nested record is malformed", async () => {
  localStorage.setItem(
    "sprout-learning-v1",
    JSON.stringify({
      ...emptyProgress(),
      completed: ["js-welcome"],
      drafts: { kept: "my code" },
      practice: {
        good: { passed: true, checkedAt: new Date().toISOString() },
        bad: { passed: true, checkedAt: "not a date" },
      },
    }),
  );
  const a = create();
  await a.flush();
  expect(a.getStatus()).toBe("saved");
  expect(a.getSnapshot().completed).toEqual(["js-welcome"]);
  expect(a.getSnapshot().practice.good.passed).toBe(true);
  expect(a.getSnapshot().practice.bad).toBeUndefined();
  expect(a.getDraft("kept")).toBe("my code");
});
it("retains a corrupt canonical snapshot when restoring a validated export", async () => {
  const { openDB } = await import("idb");
  const db = await openDB("sprout-progress-v3", 1, {
    upgrade(db) {
      db.createObjectStore("state");
    },
  });
  const corrupt = {
    progress: { drafts: { x: 42 } },
    conflicts: "invalid",
    generation: "old",
  };
  await db.put("state", corrupt, "current");
  db.close();
  const a = create();
  await a.flush();
  expect(a.getStatus()).toBe("recovery");
  await a.importData({
    format: "sprout-progress",
    version: 3,
    exportedAt: new Date().toISOString(),
    progress: { ...emptyProgress(), drafts: { restored: "safe code" } },
  });
  expect(a.getDraft("restored")).toBe("safe code");
  const check = await openDB("sprout-progress-v3", 1);
  const backup = (await check.getAllKeys("state")).find(
    (key) => typeof key === "string" && key.startsWith("recovery-"),
  );
  expect(backup).toBeDefined();
  expect(await check.get("state", backup!)).toEqual(corrupt);
  check.close();
});
