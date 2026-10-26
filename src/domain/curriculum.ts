import { z } from "zod";
export const taskSchema = z
  .object({
    id: z.string().optional(),
    revision: z.number().int(),
    starter: z.string(),
    solution: z.string(),
    checks: z.array(z.unknown()).max(100),
  })
  .passthrough();
export const lessonContentSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    category: z.enum(["JavaScript", "React"]),
    minutes: z.number(),
    code: z.string(),
    teaching: z
      .object({
        independent: taskSchema,
        tasks: z.array(taskSchema),
        exampleChecks: z.array(z.unknown()).optional(),
        expected: z
          .object({ lines: z.array(z.string()).optional() })
          .passthrough(),
      })
      .passthrough(),
  })
  .passthrough();
export const projectSchema = z
  .object({
    id: z.string(),
    category: z.enum(["JavaScript", "React"]),
    starter: z.string(),
    task: taskSchema.omit({ starter: true }).passthrough(),
  })
  .passthrough();
export type LessonContent = z.infer<typeof lessonContentSchema>;
export type PracticeTask = z.infer<typeof taskSchema>;
