export const STORAGE_KEY = "sprout-learning-v1";
export const BACKUP_KEY = "sprout-learning-backup-before-practice-v2";

export const emptyProgress = () => ({
  schemaVersion: 2,
  completed: [],
  bookmarks: [],
  activity: {},
  dailyGoal: 15,
  name: "",
  projects: {},
  drafts: {},
  practice: {},
  reflections: {},
  predictions: {},
  knowledge: {},
});

const objectOrEmpty = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

const safeKey = (key) =>
  !["__proto__", "constructor", "prototype"].includes(key) && key.length <= 240;
function cleanRecord(value, validate) {
  return Object.fromEntries(
    Object.entries(objectOrEmpty(value))
      .filter(([key, item]) => safeKey(key) && validate(item))
      .slice(0, 10000),
  );
}
const plain = (value) =>
  !!value && typeof value === "object" && !Array.isArray(value);
function evidence(value) {
  return (
    plain(value) &&
    ["passed", "assisted", "checked", "revealed", "correct"].every(
      (key) => !(key in value) || typeof value[key] === "boolean",
    ) &&
    ["revision", "attempts"].every(
      (key) =>
        !(key in value) ||
        (Number.isSafeInteger(value[key]) && value[key] >= 0),
    ) &&
    (!("cases" in value) ||
      (Array.isArray(value.cases) &&
        value.cases.length <= 100 &&
        value.cases.every(
          (item) =>
            plain(item) &&
            typeof item.label === "string" &&
            item.label.length <= 8000 &&
            typeof item.passed === "boolean",
        ))) &&
    ["fingerprint", "checkedAt", "signature"].every(
      (key) =>
        !(key in value) ||
        (typeof value[key] === "string" && value[key].length <= 100),
    )
  );
}
// Additive migration: keep legacy completions, every draft key, checklist index,
// and unknown fields. A new exercise never overwrites an old example draft.
export function migrateProgress(saved) {
  const source = objectOrEmpty(saved);
  return {
    ...emptyProgress(),
    ...source,
    schemaVersion: 2,
    completed: Array.isArray(source.completed)
      ? source.completed
          .filter((id) => typeof id === "string" && safeKey(id))
          .slice(0, 10000)
      : [],
    bookmarks: Array.isArray(source.bookmarks)
      ? source.bookmarks
          .filter((id) => typeof id === "string" && safeKey(id))
          .slice(0, 10000)
      : [],
    activity: cleanRecord(
      source.activity,
      (item) => Number.isFinite(item) && item >= 0 && item <= 100000,
    ),
    projects: Object.fromEntries(
      Object.entries(cleanRecord(source.projects, plain)).map(
        ([key, value]) => [
          key,
          cleanRecord(value, (item) => typeof item === "boolean"),
        ],
      ),
    ),
    drafts: cleanRecord(
      source.drafts,
      (item) => typeof item === "string" && item.length <= 100000,
    ),
    practice: cleanRecord(source.practice, evidence),
    predictions: cleanRecord(
      source.predictions,
      (item) =>
        evidence(item) &&
        (!("answer" in item) || typeof item.answer === "string"),
    ),
    reflections: cleanRecord(
      source.reflections,
      (item) => typeof item === "string" && item.length <= 100000,
    ),
    knowledge: cleanRecord(
      source.knowledge,
      (item) =>
        evidence(item) &&
        (!("answer" in item) || Number.isSafeInteger(item.answer)),
    ),
    name: typeof source.name === "string" ? source.name.slice(0, 200) : "",
    dailyGoal: [10, 15, 30, 45].includes(source.dailyGoal)
      ? source.dailyGoal
      : 15,
  };
}

export function readStoredProgress(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    let source;
    try {
      source = JSON.parse(raw);
      if (!source || typeof source !== "object" || Array.isArray(source))
        throw new Error("Invalid save format");
    } catch {
      try {
        if (!storage.getItem(BACKUP_KEY)) storage.setItem(BACKUP_KEY, raw);
      } catch {
        /* Keep the original key untouched. */
      }
      return { ...emptyProgress(), storageRecoveryRequired: true };
    }
    if (source && source.schemaVersion !== 2 && !storage.getItem(BACKUP_KEY)) {
      // If backing up fails, do not prevent the learner from reading their data.
      try {
        storage.setItem(BACKUP_KEY, raw);
      } catch {
        /* The original key remains intact. */
      }
    }
    return migrateProgress(source);
  } catch {
    return emptyProgress();
  }
}

export function codeFingerprint(code) {
  let hash = 2166136261;
  for (let index = 0; index < code.length; index++) {
    hash ^= code.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

export function taskSignature(task) {
  return codeFingerprint(
    JSON.stringify([
      task.revision,
      task.goal,
      task.starting,
      task.instructions,
      task.expected,
      task.constraints,
      task.starter,
      task.checks,
    ]),
  );
}

export function taskIsCurrent(record, task, code) {
  return (
    !!record?.passed &&
    record.revision === task.revision &&
    record.fingerprint ===
      (typeof code === "string"
        ? codeFingerprint(code)
        : task.starterFingerprint) &&
    (!(task.signature || task.checks) ||
      record.signature === (task.signature || taskSignature(task)))
  );
}

export function practiceEvidence(progress, lesson) {
  const task = lesson.teaching.independent;
  const key = `exercise-${lesson.id}-independent`;
  return taskIsCurrent(
    progress.practice[key],
    task,
    progress.drafts[key] ?? task.starter,
  );
}
