import { normalizeLegacy } from "../domain/normalize-legacy";
import { z } from "zod";
import { openDB, type IDBPDatabase } from "idb";
import { useSyncExternalStore } from "react";
import {
  progressSchema,
  exportSchema,
  draftConflictSchema,
  type Progress,
  type DraftConflict,
} from "../domain/progress";
import { readStoredProgress, emptyProgress } from "../learning/progress.js";

const DB_NAME = "sprout-progress-v3";
const JOURNAL_PREFIX = "sprout-pending-v3-";
type Change = {
  field: keyof Progress;
  key?: string;
  value: unknown;
  base: unknown;
};
const storedSchema = z.object({
  progress: progressSchema,
  conflicts: z.array(draftConflictSchema).max(10000),
  generation: z.string().min(1).max(100),
  reset: z.boolean().optional(),
});
type Stored = z.infer<typeof storedSchema>;
const parseStored = (raw: unknown): Stored => storedSchema.parse(raw);
export type SaveStatus = "loading" | "saving" | "saved" | "error" | "recovery";
const same = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);
const recordFields = new Set([
  "drafts",
  "practice",
  "projects",
  "activity",
  "reflections",
  "predictions",
  "knowledge",
]);
const safe = (key: string) =>
  !["__proto__", "constructor", "prototype"].includes(key);

export class ProgressStore {
  private data: Progress;
  private snapshot: Progress;
  private status: SaveStatus = "loading";
  private listeners = new Set<() => void>();
  private statusListeners = new Set<() => void>();
  private draftListeners = new Map<string, Set<() => void>>();
  private pending = new Map<string, Change>();
  private db?: IDBPDatabase;
  private channel?: BroadcastChannel;
  private timer?: ReturnType<typeof setTimeout>;
  private flushing?: Promise<void>;
  private generation = "initial";
  private conflicts: DraftConflict[] = [];
  private tab = crypto.randomUUID();
  private initialized = false;
  private ready: Promise<void>;
  constructor(private storage?: Storage) {
    this.data = normalizeLegacy(
      readStoredProgress(storage || { getItem: () => null, setItem: () => {} }),
      emptyProgress() as Progress,
    );
    this.snapshot = this.data;
    this.ready = this.initialize();
  }
  private setStatus(status: SaveStatus) {
    this.status = status;
    this.statusListeners.forEach((fn) => fn());
  }
  private publish(draftsOnly = false, keys: string[] = []) {
    for (const key of keys) this.draftListeners.get(key)?.forEach((fn) => fn());
    if (!draftsOnly) {
      this.snapshot = { ...this.data };
      this.listeners.forEach((fn) => fn());
    }
  }
  private async initialize() {
    try {
      this.db = await openDB(DB_NAME, 1, {
        upgrade(db) {
          db.createObjectStore("state");
        },
      });
      this.channel =
        typeof BroadcastChannel !== "undefined"
          ? new BroadcastChannel(DB_NAME)
          : undefined;
      if (this.channel)
        this.channel.onmessage = () => {
          void this.refresh().catch(() => this.setStatus("error"));
        };
      const tx = this.db.transaction("state", "readwrite");
      const raw: unknown = await tx.store.get("current");
      let stored = raw === undefined ? undefined : parseStored(raw);
      if (!stored && this.data.storageRecoveryRequired) {
        await tx.done;
        this.initialized = true;
        this.setStatus("recovery");
        return;
      }
      if (!stored) {
        stored = {
          progress: this.data,
          conflicts: [],
          generation: crypto.randomUUID(),
        };
        await tx.store.put(stored, "current");
      }
      await tx.done;
      const validated = progressSchema.safeParse(stored.progress);
      if (!validated.success) {
        this.setStatus("recovery");
        return;
      }
      this.data = validated.data;
      this.generation = stored.generation;
      this.conflicts = stored.conflicts || [];
      this.initialized = true;
      let recoveryFailed = false;
      // Recovery journals are separate per tab. Replay through the same conflict-aware transaction.
      if (this.storage)
        for (let i = 0; i < this.storage.length; i++) {
          const key = this.storage.key(i);
          if (!key?.startsWith(JOURNAL_PREFIX)) continue;
          try {
            const entry: unknown = JSON.parse(
              this.storage.getItem(key) || "null",
            );
            if (
              entry &&
              typeof entry === "object" &&
              "generation" in entry &&
              (entry.generation === this.generation ||
                (entry.generation === "initial" && !stored.reset)) &&
              "changes" in entry &&
              Array.isArray(entry.changes)
            ) {
              for (const change of entry.changes)
                if (this.validChange(change))
                  this.pending.set(this.changeId(change), change);
              await this.commit();
            }
            this.storage.removeItem(key);
            i--;
          } catch {
            recoveryFailed = true;
            this.setStatus("error");
          }
        }
      this.publish();
      this.setStatus(recoveryFailed ? "error" : "saved");
    } catch {
      this.initialized = true;
      if (this.db) {
        this.data = { ...this.data, storageRecoveryRequired: true };
        this.publish();
        this.setStatus("recovery");
      } else this.setStatus("error");
    }
  }
  private validChange(value: unknown): value is Change {
    if (
      !value ||
      typeof value !== "object" ||
      !("field" in value) ||
      typeof value.field !== "string" ||
      !safe(value.field)
    )
      return false;
    if (
      !(value.field in progressSchema.shape) ||
      value.field === "schemaVersion"
    )
      return false;
    if ("key" in value && (typeof value.key !== "string" || !safe(value.key)))
      return false;
    return "value" in value && "base" in value;
  }
  private changeId(change: Change) {
    return `${String(change.field)}:${change.key || ""}`;
  }
  private journal() {
    try {
      if (this.pending.size)
        this.storage?.setItem(
          JOURNAL_PREFIX + this.tab,
          JSON.stringify({
            generation: this.generation,
            changes: [...this.pending.values()],
          }),
        );
      else this.storage?.removeItem(JOURNAL_PREFIX + this.tab);
    } catch {
      this.setStatus("error");
    }
  }
  private enqueue(change: Change) {
    const id = this.changeId(change);
    const previous = this.pending.get(id);
    this.pending.set(id, {
      ...change,
      base: previous ? previous.base : change.base,
    });
  }
  update = (updater: (previous: Progress) => Progress) => {
    if (!this.initialized) return;
    const next = updater(this.data);
    const parsed = progressSchema.safeParse(next);
    if (!parsed.success) {
      this.setStatus("error");
      return;
    }
    for (const field of Object.keys(next) as (keyof Progress)[]) {
      if (same(next[field], this.data[field])) continue;
      if (recordFields.has(field)) {
        const before = (this.data[field] || {}) as Record<string, unknown>;
        const after = (next[field] || {}) as Record<string, unknown>;
        for (const key of new Set([
          ...Object.keys(before),
          ...Object.keys(after),
        ]))
          if (safe(key) && !same(before[key], after[key]))
            this.enqueue({
              field,
              key,
              base: before[key] ?? null,
              value: after[key] ?? null,
            });
      } else
        this.enqueue({
          field,
          base: this.data[field] ?? null,
          value: next[field] ?? null,
        });
    }
    this.data = parsed.data;
    this.publish();
    this.schedule();
  };
  saveDraft = (key: string, code: string) => {
    if (!this.initialized || !safe(key)) return;
    if (code.length > 100000) {
      this.setStatus("error");
      return;
    }
    if (this.data.drafts[key] === code) return;
    this.enqueue({
      field: "drafts",
      key,
      base: this.data.drafts[key] ?? null,
      value: code,
    });
    this.data = { ...this.data, drafts: { ...this.data.drafts, [key]: code } };
    this.publish(true, [key]);
    this.schedule();
  };
  private schedule() {
    this.setStatus("saving");
    clearTimeout(this.timer);
    // Write only pending entities; pagehide also flushes this small recovery journal synchronously.
    this.timer = setTimeout(() => {
      this.journal();
      void this.flush();
    }, 250);
  }
  private async commit() {
    if (!this.db || !this.pending.size) return;
    const changes = [...this.pending.values()];
    const tx = this.db.transaction("state", "readwrite");
    const stored = parseStored(await tx.store.get("current"));
    if (stored.generation !== this.generation && !stored.reset)
      this.generation = stored.generation;
    if (stored.generation !== this.generation) {
      this.pending.clear();
      this.data = stored.progress;
      this.generation = stored.generation;
      this.conflicts = stored.conflicts;
      await tx.done;
      this.journal();
      this.publish(false, [...this.draftListeners.keys()]);
      return;
    }
    const next = structuredClone(stored.progress);
    const completionChange = changes.find(
      (change) => change.field === "completed",
    );
    const newlyCompleted = completionChange
      ? (completionChange.value as string[]).filter(
          (id) =>
            !(completionChange.base as string[]).includes(id) &&
            !stored.progress.completed.includes(id),
        )
      : [];
    const historyChange = changes.find((change) => change.field === "history");
    const completionEvents = (
      (historyChange?.value || []) as NonNullable<Progress["history"]>
    ).filter(
      (event) =>
        event.kind === "completion" && newlyCompleted.includes(event.subject),
    );
    for (const change of changes) {
      if (change.key && recordFields.has(String(change.field))) {
        const target = next[change.field] as Record<string, unknown>;
        const current = target[change.key] ?? null;
        if (
          (change.field === "drafts" || change.field === "reflections") &&
          !same(current, change.base) &&
          !same(current, change.value)
        ) {
          stored.conflicts.push({
            id: crypto.randomUUID(),
            key: change.key,
            field: change.field,
            local: String(change.value ?? ""),
            other: String(current ?? ""),
            at: new Date().toISOString(),
          });
          // Keep the current canonical copy. The local copy is retained in the conflict.
          continue;
        }
        if (change.field === "activity" && typeof change.value === "number") {
          const added = completionEvents.filter(
            (event) => event.day === change.key,
          );
          const delta =
            completionChange && completionEvents.length
              ? added.reduce(
                  (sum, event) => sum + (event.estimatedMinutes || 0),
                  0,
                )
              : completionChange &&
                  (completionChange.value as string[]).some(
                    (id) => !(completionChange.base as string[]).includes(id),
                  ) &&
                  !newlyCompleted.length
                ? 0
                : change.value -
                  (typeof change.base === "number" ? change.base : 0);
          target[change.key] = Math.max(
            0,
            (typeof current === "number" ? current : 0) + delta,
          );
        } else if (
          change.field === "practice" &&
          current &&
          change.value &&
          typeof current === "object" &&
          typeof change.value === "object"
        ) {
          const previous = current as Progress["practice"][string];
          const incoming = change.value as Progress["practice"][string];
          const incomingNewer =
            (incoming.checkedAt || "") >= (previous.checkedAt || "");
          target[change.key] = {
            ...(incomingNewer ? previous : incoming),
            ...(incomingNewer ? incoming : previous),
            assisted: !!previous.assisted || !!incoming.assisted,
          };
        } else if (
          change.field === "projects" &&
          current &&
          change.value &&
          typeof current === "object" &&
          typeof change.value === "object"
        ) {
          const merged = { ...current } as Record<string, unknown>;
          const base =
            change.base && typeof change.base === "object"
              ? (change.base as Record<string, unknown>)
              : {};
          for (const [index, value] of Object.entries(change.value))
            if (!same(value, base[index])) merged[index] = value;
          target[change.key] = merged;
        } else if (change.value === null) delete target[change.key];
        else target[change.key] = change.value;
      } else if (change.field === "completed" || change.field === "bookmarks") {
        const base = change.base as string[];
        const value = change.value as string[];
        next[change.field] = [
          ...new Set([
            ...(next[change.field] as string[]).filter(
              (id) => !base.includes(id) || value.includes(id),
            ),
            ...value,
          ]),
        ];
      } else if (change.field === "history") {
        const events = [
          ...(next.history || []),
          ...(change.value as NonNullable<Progress["history"]>),
        ];
        next.history = [
          ...new Map(events.map((event) => [event.id, event])).values(),
        ]
          .sort((a, b) => a.at.localeCompare(b.at))
          .slice(-2000);
      } else Object.assign(next, { [change.field]: change.value });
    }
    const validated = progressSchema.safeParse(next);
    if (!validated.success) {
      tx.abort();
      throw new Error("Invalid saved data");
    }
    stored.progress = validated.data;
    await tx.store.put(stored, "current");
    await tx.done;
    for (const change of changes)
      if (this.pending.get(this.changeId(change)) === change)
        this.pending.delete(this.changeId(change));
    this.conflicts = stored.conflicts;
    // Keep edits made while the transaction was awaiting disk.
    this.data = this.applyPending(stored.progress);
    this.publish(
      changes.every((c) => c.field === "drafts"),
      changes.filter((c) => c.field === "drafts").map((c) => c.key!),
    );
    this.journal();
    this.channel?.postMessage({ updated: true });
  }
  private applyPending(base: Progress): Progress {
    const next = { ...base };
    for (const change of this.pending.values()) {
      if (change.key)
        Object.assign(next, {
          [change.field]: {
            ...(next[change.field] as Record<string, unknown>),
            [change.key]: change.value,
          },
        });
      else Object.assign(next, { [change.field]: change.value });
    }
    return next;
  }
  flush = async (): Promise<void> => {
    await this.ready;
    if (this.flushing) {
      try {
        await this.flushing;
      } catch {
        this.journal();
        this.setStatus("error");
        return;
      }
      if (this.pending.size) return this.flush();
      return;
    }
    if (!this.initialized) return;
    if (!this.db || this.data.storageRecoveryRequired) {
      this.journal();
      this.setStatus(this.data.storageRecoveryRequired ? "recovery" : "error");
      return;
    }
    this.flushing = this.commit();
    try {
      await this.flushing;
      this.setStatus("saved");
    } catch {
      this.journal();
      this.setStatus("error");
    } finally {
      this.flushing = undefined;
    }
  };
  checkpoint = () => {
    this.journal();
    void this.flush();
  };
  private async refresh() {
    if (!this.db) return;
    const stored = parseStored(await this.db.get("state", "current"));
    if (!progressSchema.safeParse(stored.progress).success) return;
    if (this.generation !== stored.generation) {
      if (stored.reset) this.pending.clear();
      this.generation = stored.generation;
      this.journal();
    }
    this.data = this.applyPending(stored.progress);
    this.conflicts = stored.conflicts;
    this.publish(false, [...this.draftListeners.keys()]);
    if (this.pending.size) this.schedule();
    else this.setStatus("saved");
  }
  resolveConflict = async (id: string, choice: "local" | "other") => {
    await this.flush();
    if (!this.db) throw new Error("Local storage is unavailable");
    const tx = this.db.transaction("state", "readwrite");
    const stored = parseStored(await tx.store.get("current"));
    const conflict = stored.conflicts.find((item) => item.id === id);
    let resolved = true;
    if (conflict) {
      const field = conflict.field || "drafts";
      const current = stored.progress[field][conflict.key] ?? "";
      const chosen = conflict[choice];
      stored.conflicts = stored.conflicts.filter((item) => item.id !== id);
      if (current !== conflict.other && current !== chosen) {
        resolved = false;
        stored.conflicts.push({
          ...conflict,
          id: crypto.randomUUID(),
          local: chosen,
          other: current,
          at: new Date().toISOString(),
        });
      } else stored.progress[field][conflict.key] = chosen;
      await tx.store.put(stored, "current");
    }
    await tx.done;
    await this.refresh();
    this.channel?.postMessage({ updated: true });
    return resolved;
  };
  exportData = async () => {
    await this.flush();
    return exportSchema.parse({
      format: "sprout-progress",
      version: 3,
      exportedAt: new Date().toISOString(),
      progress: this.data,
      conflicts: this.conflicts,
    });
  };
  importData = async (raw: unknown) => {
    await this.ready;
    const envelope = exportSchema.parse(raw);
    const imported = envelope.progress;
    if (this.data.storageRecoveryRequired) {
      if (!this.db) throw new Error("Local storage is unavailable");
      const tx = this.db.transaction("state", "readwrite");
      const existing: unknown = await tx.store.get("current");
      if (!storedSchema.safeParse(existing).success) {
        if (existing !== undefined)
          await tx.store.put(existing, "recovery-" + crypto.randomUUID());
        this.generation = crypto.randomUUID();
        this.data = progressSchema.parse({
          ...this.data,
          storageRecoveryRequired: false,
        });
        await tx.store.put(
          { progress: this.data, conflicts: [], generation: this.generation },
          "current",
        );
      } else {
        const current = parseStored(existing);
        this.generation = current.generation;
        this.data = this.applyPending(current.progress);
      }
      await tx.done;
      this.channel?.postMessage({ updated: true });
    }
    const fresh =
      !this.data.name &&
      !this.data.completed.length &&
      !Object.keys(this.data.drafts).length;

    this.update((previous) => ({
      ...imported,
      ...previous,
      name: previous.name || imported.name,
      dailyGoal: fresh ? imported.dailyGoal : previous.dailyGoal,
      streaksEnabled: previous.streaksEnabled ?? imported.streaksEnabled,
      lastLesson: previous.lastLesson ?? imported.lastLesson,
      completed: [...new Set([...previous.completed, ...imported.completed])],
      bookmarks: [...new Set([...previous.bookmarks, ...imported.bookmarks])],
      projects: { ...imported.projects, ...previous.projects },
      practice: { ...imported.practice, ...previous.practice },
      knowledge: { ...imported.knowledge, ...previous.knowledge },
      drafts: { ...imported.drafts, ...previous.drafts },
      predictions: { ...imported.predictions, ...previous.predictions },
      reflections: { ...imported.reflections, ...previous.reflections },
      activity: { ...imported.activity, ...previous.activity },
      history: [
        ...(previous.history || []),
        ...(imported.history || []),
        {
          id: crypto.randomUUID(),
          at: new Date().toISOString(),
          kind: "import",
          subject: "Progress merged; existing drafts kept",
        },
      ].slice(-2000) as Progress["history"],
    }));
    // Import is complete only after every alternative version is durable.
    await this.addImportConflicts(imported, envelope.conflicts || []);
  };
  private async addImportConflicts(
    imported: Progress,
    alternatives: DraftConflict[],
  ) {
    await this.flush();
    if (!this.db) return;
    const tx = this.db.transaction("state", "readwrite");
    const stored = parseStored(await tx.store.get("current"));
    for (const alternative of alternatives)
      if (
        !stored.conflicts.some(
          (current) =>
            current.key === alternative.key &&
            current.local === alternative.local &&
            current.other === alternative.other &&
            current.field === alternative.field,
        )
      )
        stored.conflicts.push({ ...alternative, id: crypto.randomUUID() });
    for (const [key, code] of Object.entries(imported.drafts))
      if (key in stored.progress.drafts && stored.progress.drafts[key] !== code)
        stored.conflicts.push({
          id: crypto.randomUUID(),
          key,
          local: code,
          other: stored.progress.drafts[key],
          at: new Date().toISOString(),
        });
    await tx.store.put(stored, "current");
    await tx.done;
    await this.refresh();
    this.channel?.postMessage({ updated: true });
  }
  reset = async (scope: "drafts" | "evidence" | "all") => {
    await this.flush();
    if (!this.db) throw new Error("Local storage is unavailable");
    const tx = this.db.transaction("state", "readwrite");
    const raw: unknown = await tx.store.get("current");
    const stored: Stored =
      scope === "all"
        ? {
            progress: emptyProgress() as Progress,
            conflicts: [],
            generation: crypto.randomUUID(),
          }
        : parseStored(raw);
    if (scope === "all") stored.progress = emptyProgress() as Progress;
    if (scope === "drafts") {
      stored.progress.drafts = {};
      stored.conflicts = stored.conflicts.filter(
        (conflict) => conflict.field === "reflections",
      );
    }
    if (scope === "evidence") {
      stored.progress.practice = {};
      stored.progress.knowledge = {};
      stored.progress.predictions = {};
    }
    if (scope !== "all")
      stored.progress.history = [
        ...(stored.progress.history || []),
        {
          id: crypto.randomUUID(),
          at: new Date().toISOString(),
          kind: "reset" as const,
          subject:
            scope === "drafts" ? "Code drafts reset" : "Check evidence reset",
        },
      ].slice(-2000);
    stored.generation = crypto.randomUUID();
    stored.reset = true;
    if (scope === "all") {
      for (const key of await tx.store.getAllKeys())
        if (typeof key === "string" && key.startsWith("recovery-"))
          await tx.store.delete(key);
      stored.conflicts = [];
      this.storage?.removeItem("sprout-learning-v1");
      this.storage?.removeItem("sprout-learning-backup-before-practice-v2");
      if (this.storage)
        for (let i = this.storage.length - 1; i >= 0; i--) {
          const key = this.storage.key(i);
          if (key?.startsWith(JOURNAL_PREFIX)) this.storage.removeItem(key);
        }
    }
    await tx.store.put(stored, "current");
    await tx.done;
    await this.refresh();
    this.channel?.postMessage({ updated: true });
  };
  refreshView = () => {
    this.snapshot = { ...this.data };
    this.publish();
  };
  getCurrent = () => this.data;
  getGeneration = () => this.generation;
  getSnapshot = () => this.snapshot;
  getStatus = () => this.status;
  getConflicts = () => this.conflicts;
  getDraft = (key: string) => this.data.drafts[key];
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  subscribeStatus = (listener: () => void) => {
    this.statusListeners.add(listener);
    return () => {
      this.statusListeners.delete(listener);
    };
  };
  subscribeDraft = (key: string, listener: () => void) => {
    const listeners = this.draftListeners.get(key) || new Set();
    listeners.add(listener);
    this.draftListeners.set(key, listeners);
    return () => {
      listeners.delete(listener);
    };
  };
  close = () => {
    clearTimeout(this.timer);
    this.channel?.close();
    this.db?.close();
  };
}
let singleton: ProgressStore | undefined;
export function getProgressStore() {
  if (!singleton) {
    let storage: Storage | undefined;
    try {
      storage = localStorage;
    } catch {
      /* UI shows saving failure. */
    }
    singleton = new ProgressStore(storage);
    window.addEventListener("pagehide", singleton.checkpoint);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) singleton?.checkpoint();
    });
  }
  return singleton;
}
export function useProgress() {
  const store = getProgressStore();
  return [
    useSyncExternalStore(store.subscribe, store.getSnapshot),
    store.update,
  ] as const;
}
export function useSaveStatus() {
  const store = getProgressStore();
  return useSyncExternalStore(store.subscribeStatus, store.getStatus);
}
export function useDraft(key: string) {
  const store = getProgressStore();
  return useSyncExternalStore(
    (listener) => store.subscribeDraft(key, listener),
    () => store.getDraft(key),
  );
}

export function useStorageGeneration() {
  const store = getProgressStore();
  return useSyncExternalStore(store.subscribe, store.getGeneration);
}
