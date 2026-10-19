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

// Additive migration: keep legacy completions, every draft key, checklist index,
// and unknown fields. A new exercise never overwrites an old example draft.
export function migrateProgress(saved) {
  const source = objectOrEmpty(saved);
  return {
    ...emptyProgress(),
    ...source,
    schemaVersion: 2,
    completed: Array.isArray(source.completed)
      ? source.completed.filter((id) => typeof id === "string")
      : [],
    bookmarks: Array.isArray(source.bookmarks)
      ? source.bookmarks.filter((id) => typeof id === "string")
      : [],
    activity: objectOrEmpty(source.activity),
    projects: objectOrEmpty(source.projects),
    drafts: objectOrEmpty(source.drafts),
    practice: objectOrEmpty(source.practice),
    predictions: objectOrEmpty(source.predictions),
    reflections: objectOrEmpty(source.reflections),
    knowledge: objectOrEmpty(source.knowledge),
    name: typeof source.name === "string" ? source.name : "",
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

export function taskIsCurrent(record, task, code) {
  return (
    !!record?.passed &&
    record.revision === task.revision &&
    record.fingerprint === codeFingerprint(code)
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
