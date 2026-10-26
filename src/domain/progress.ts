import { z } from "zod";

export const safeKey = z
  .string()
  .min(1)
  .max(240)
  .refine(
    (value) => !["__proto__", "constructor", "prototype"].includes(value),
  );
const boundedText = z.string().max(100000);
const evidenceSchema = z
  .object({
    passed: z.boolean().optional(),
    assisted: z.boolean().optional(),
    revision: z.number().int().nonnegative().optional(),
    fingerprint: z.string().max(100).optional(),
    signature: z.string().max(100).optional(),
    checkedAt: z.string().datetime().optional(),
    cases: z
      .array(z.object({ label: z.string().max(8000), passed: z.boolean() }))
      .max(100)
      .optional(),
  })
  .passthrough();
export const historyEventSchema = z.object({
  id: z.string().max(100),
  at: z.string().datetime(),
  kind: z.enum(["check", "assistance", "completion", "import", "reset"]),
  subject: z.string().max(240),
  passed: z.boolean().optional(),
  assisted: z.boolean().optional(),
  estimatedMinutes: z.number().nonnegative().max(240).optional(),
  day: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});
export type HistoryEvent = z.infer<typeof historyEventSchema>;
export const progressSchema = z
  .object({
    schemaVersion: z.literal(2),
    completed: z.array(safeKey).max(10000),
    bookmarks: z.array(safeKey).max(10000),
    activity: z.record(safeKey, z.number().finite().nonnegative().max(100000)),
    dailyGoal: z.union([
      z.literal(10),
      z.literal(15),
      z.literal(30),
      z.literal(45),
    ]),
    name: z.string().max(200),
    projects: z.record(
      safeKey,
      z.record(z.string().regex(/^\d{1,4}$/), z.boolean()),
    ),
    drafts: z.record(safeKey, boundedText),
    practice: z.record(safeKey, evidenceSchema),
    reflections: z.record(safeKey, boundedText),
    predictions: z.record(
      safeKey,
      z
        .object({
          answer: boundedText.optional(),
          revealed: z.boolean().optional(),
          correct: z.boolean().optional(),
          checked: z.boolean().optional(),
          passed: z.boolean().optional(),
          revision: z.number().int().optional(),
        })
        .passthrough(),
    ),
    knowledge: z.record(
      safeKey,
      z
        .object({
          passed: z.boolean().optional(),
          checked: z.boolean().optional(),
          signature: z.string().max(100).optional(),
          revision: z.number().int().optional(),
          answer: z.number().int().optional(),
          attempts: z.number().int().nonnegative().optional(),
        })
        .passthrough(),
    ),
    history: z.array(historyEventSchema).max(2000).optional(),
    streaksEnabled: z.boolean().optional(),
    lastLesson: safeKey.optional(),
  })
  .passthrough();
export type Progress = z.infer<typeof progressSchema>;
export type Evidence = z.infer<typeof evidenceSchema>;
export const draftConflictSchema = z.object({
  id: z.string().max(100),
  key: safeKey,
  local: boundedText,
  other: boundedText,
  at: z.string().datetime(),
  field: z.enum(["drafts", "reflections"]).optional(),
});
export type DraftConflict = z.infer<typeof draftConflictSchema>;
export const exportSchema = z.object({
  format: z.literal("sprout-progress"),
  version: z.literal(3),
  exportedAt: z.string().datetime(),
  progress: progressSchema,
  conflicts: z.array(draftConflictSchema).max(10000).optional(),
});
