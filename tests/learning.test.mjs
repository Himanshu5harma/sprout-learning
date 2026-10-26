import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { allLessons, orderedLessons, projects } from "../src/curriculum.js";
import {
  migrateProgress,
  readStoredProgress,
  STORAGE_KEY,
  BACKUP_KEY,
  codeFingerprint,
  taskIsCurrent,
} from "../src/learning/progress.js";
import { predictionMatches } from "../src/learning/predictions.js";
import { compileReact } from "../src/learning/compile-react.js";
import { execute } from "./execution-helper.mjs";

const passed = (result) =>
  !result.error &&
  result.checks.length > 0 &&
  result.checks.every((check) => check.passed);

test("legacy progress, drafts, checklist order, and unknown fields survive additive migration", async () => {
  const baseline = JSON.parse(
    await readFile(new URL("./legacy-fixture.json", import.meta.url)),
  );
  const saved = {
    completed: baseline.lessonIds,
    bookmarks: ["js-functions"],
    activity: { "2026-10-18": 30 },
    dailyGoal: 30,
    name: "Existing learner",
    drafts: {
      "lesson-js-welcome": "console.log('my saved work');",
      "lab-React": "function App(){return <p>My work</p>;}",
      "project-greeting": "uncompleted personal draft",
    },
    projects: { greeting: { 0: true, 2: true }, budget: { 1: true } },
    futureField: { keep: true },
  };
  const result = migrateProgress(saved);
  for (const key of Object.keys(saved))
    assert.deepEqual(result[key], saved[key], key);
  assert.equal(result.schemaVersion, 2);
  const byId = new Map(allLessons.map((lesson) => [lesson.id, lesson]));
  for (const id of baseline.lessonIds)
    assert.ok(byId.has(id), `retained ${id}`);
  for (const [id, requirements] of Object.entries(baseline.checklists))
    assert.deepEqual(
      projects.find((project) => project.id === id).requirements,
      requirements,
      id,
    );
  const storage = new Map([[STORAGE_KEY, JSON.stringify(saved)]]);
  const adapter = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  };
  readStoredProgress(adapter);
  assert.equal(
    storage.get(STORAGE_KEY),
    JSON.stringify(saved),
    "reader never clears or rewrites the original key",
  );
  assert.equal(storage.get(BACKUP_KEY), JSON.stringify(saved));
  readStoredProgress(adapter);
  assert.equal(
    storage.get(BACKUP_KEY),
    JSON.stringify(saved),
    "backup remains the original snapshot",
  );
});

test("an unreadable save is retained for recovery instead of becoming an empty replacement", () => {
  const original = '{"completed":["js-welcome"],"drafts":';
  const storage = new Map([[STORAGE_KEY, original]]);
  const result = readStoredProgress({
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  });
  assert.equal(result.storageRecoveryRequired, true);
  assert.equal(storage.get(STORAGE_KEY), original);
  assert.equal(storage.get(BACKUP_KEY), original);
});

test("practical evidence is invalidated by editing or changing the task revision", () => {
  const task = { revision: 2 };
  const code = "const double = value => value * 2;";
  const record = {
    passed: true,
    revision: 2,
    fingerprint: codeFingerprint(code),
    assisted: true,
  };
  assert.equal(taskIsCurrent(record, task, code), true);
  assert.equal(taskIsCurrent(record, task, code + "\n// a new draft"), false);
  assert.equal(taskIsCurrent(record, { revision: 3 }, code), false);
  assert.equal(taskIsCurrent({ ...record, passed: false }, task, code), false);
});

test("prediction checking accepts equivalent JSON spacing without ignoring output order", () => {
  assert.ok(predictionMatches("[2,4]", "[\n  2,\n  4\n]"));
  assert.ok(predictionMatches(" Tea\nCoffee ", "Tea\nCoffee"));
  assert.equal(predictionMatches("Coffee\nTea", "Tea\nCoffee"), false);
});

test("all prerequisites are available earlier and all example lines are explained", () => {
  const seen = new Set();
  assert.ok(
    orderedLessons.findIndex((lesson) => lesson.id === "react-sharing") <
      orderedLessons.findIndex((lesson) => lesson.id === "js-promises"),
    "The first interface does not require advanced async lessons",
  );
  assert.equal(
    new Set(allLessons.map((lesson) => lesson.id)).size,
    allLessons.length,
  );
  for (const lesson of orderedLessons) {
    const teaching = lesson.teaching;
    assert.ok(
      teaching.brief.split(/\s+/).length <= 55,
      `${lesson.id} has a concise default explanation`,
    );
    for (const prerequisite of teaching.prerequisites)
      assert.ok(seen.has(prerequisite), `${lesson.id} before ${prerequisite}`);
    seen.add(lesson.id);
    const covered = new Set(
      teaching.walkthrough.flatMap((item) =>
        Array.from(
          { length: item.to - item.from + 1 },
          (_, i) => item.from + i,
        ),
      ),
    );
    for (const [index, line] of lesson.code.split("\n").entries())
      if (line.trim())
        assert.ok(covered.has(index + 1), `${lesson.id}:${index + 1}`);
    assert.ok(
      teaching.goal &&
        teaching.why &&
        teaching.connection &&
        teaching.recap.length,
    );
    assert.ok(
      teaching.independent.checks.length &&
        teaching.independent.hints.length >= 2,
    );
    assert.ok(
      lesson.quiz.answer >= 0 &&
        lesson.quiz.answer < lesson.quiz.options.length,
    );
  }
});

test("all JavaScript examples and reference solutions produce their declared behaviour", async (t) => {
  for (const lesson of allLessons.filter(
    (lesson) => lesson.category === "JavaScript",
  )) {
    await t.test(lesson.id, async () => {
      const example = await execute(lesson.code);
      assert.equal(
        example.error,
        undefined,
        `${lesson.id} example: ${example.error}`,
      );
      assert.deepEqual(
        example.lines,
        lesson.teaching.expected.lines,
        `${lesson.id} expected output`,
      );
      for (const task of [
        ...lesson.teaching.tasks,
        lesson.teaching.independent,
      ]) {
        const result = await execute(task.solution, task.checks);
        assert.ok(
          passed(result),
          `${lesson.id}/${task.id}: ${JSON.stringify(result)}`,
        );
      }
    });
  }
});

test("guided JavaScript gaps and mistakes are actually detected", async (t) => {
  for (const lesson of allLessons.filter(
    (lesson) => lesson.category === "JavaScript",
  )) {
    await t.test(lesson.id, async () => {
      for (const task of lesson.teaching.tasks.filter(
        (task) => task.id !== "modify",
      )) {
        assert.equal(
          passed(await execute(task.starter, task.checks)),
          false,
          `${lesson.id}/${task.id} already passes without a fix`,
        );
      }
    });
  }
});

test("checks accept alternative solutions and distinguish returning from logging", async () => {
  const task = allLessons.find((lesson) => lesson.id === "js-functions")
    .teaching.independent;
  assert.ok(
    passed(
      await execute(
        "const orderTotal = (items, fee) => fee + items;",
        task.checks,
      ),
    ),
  );
  const wrong = await execute(
    "function orderTotal(items, fee) { console.log(items + fee); }",
    task.checks,
  );
  assert.equal(passed(wrong), false);
  assert.ok(wrong.checks.some((check) => check.actual === "undefined"));
  const cart = projects.find((project) => project.id === "shop-logic").task;
  const alternative =
    "const cartTotal = items => items.reduce((sum, item) => sum + item.quantity * item.price, 0); const deliveryFor = sum => sum > 0 && sum < 20 ? 3 : 0;";
  assert.ok(passed(await execute(alternative, cart.checks)));
});

test("worker captures later timer output and reports asynchronous callback failures", async () => {
  assert.deepEqual(
    (
      await execute(
        'console.log("Now"); setTimeout(() => console.log("Later"), 20);',
      )
    ).lines,
    ["Now", "Later"],
  );
  const failed = await execute(
    'setTimeout(() => { throw new Error("Callback failed"); }, 10);',
  );
  assert.equal(failed.error, "Callback failed");
  assert.equal(
    (await execute("while (true) {}", [], 150)).error,
    "Execution limit",
  );
});

test("all React examples and task variants compile with the installed JSX compiler", async () => {
  let count = 0;
  for (const lesson of allLessons.filter(
    (lesson) => lesson.category === "React",
  )) {
    for (const source of [
      lesson.code,
      ...lesson.teaching.tasks.flatMap((task) => [task.starter, task.solution]),
      lesson.teaching.independent.solution,
    ]) {
      await assert.doesNotReject(() => compileReact(source), lesson.id);
      count++;
    }
  }
  assert.ok(count >= 150);
});

test("JavaScript project reference solutions pass their explicit boundaries", async () => {
  for (const project of projects.filter(
    (project) => project.category === "JavaScript",
  ))
    assert.ok(
      passed(await execute(project.task.solution, project.task.checks)),
      project.id,
    );
});
