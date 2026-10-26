import { z } from "zod";

const text = z.string().max(8000);
export const checkResultSchema = z.object({
  index: z.number().int().optional(),
  label: text,
  passed: z.boolean(),
  actual: text.optional(),
  expected: text.optional(),
  help: text.optional(),
});
export const resultSchema = z.object({
  lines: z.array(text).max(150),
  checks: z.array(checkResultSchema).max(100),
  error: text.optional(),
  errorName: text.optional(),
  cancelled: z.boolean().optional(),
});
export type ExecutionResult = z.infer<typeof resultSchema>;
export interface PreviewNode {
  id: number;
  type: string;
  text?: string;
  hidden?: boolean;
  props?: Record<
    string,
    string | number | boolean | null | Record<string, string | number>
  >;
  children?: PreviewNode[];
}
const propSchema = z.union([
  text,
  z.number().finite(),
  z.boolean(),
  z.null(),
  z.record(z.string().max(60), z.union([text, z.number().finite()])),
]);
export const treeSchema: z.ZodType<PreviewNode> = z.lazy(() =>
  z.object({
    id: z.number().int().nonnegative(),
    type: z.string().max(40),
    text: text.optional(),
    hidden: z.boolean().optional(),
    props: z.record(z.string().max(80), propSchema).optional(),
    children: z.array(treeSchema).max(2000).optional(),
  }),
);
export const guestEventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("tree"), tree: z.array(treeSchema).max(2000) }),
  z.object({ type: z.literal("log"), line: text }),
  z.object({ type: z.literal("focus"), id: z.number().int() }),
  z.object({
    type: z.literal("timers"),
    count: z.number().int().nonnegative(),
  }),
  z.object({
    type: z.literal("error"),
    error: text,
    errorName: text.optional(),
  }),
  z.object({ type: z.literal("result"), result: resultSchema }),
]);
const uiCheck = z.object({
  label: text,
  steps: z.array(z.record(z.string(), z.unknown())).max(100),
});
const jsCheck = z.object({
  label: text,
  kind: z.string().optional(),
  expression: text.optional(),
  expected: z.unknown(),
  help: text.optional(),
});
export const startSchema = z.object({
  type: z.literal("start"),
  runId: z.string().max(100),
  language: z.enum(["JavaScript", "React"]),
  code: z.string().max(100000),
  checks: z.array(z.union([uiCheck, jsCheck])).max(100),
});
export const commandSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("render") }),
  z.object({ type: z.literal("unmount") }),
  z.object({
    type: z.literal("event"),
    id: z.number().int(),
    event: z.enum(["onClick", "onChange", "onInput", "onSubmit", "onKeyDown"]),
    value: z.string().max(10000).optional(),
    checked: z.boolean().optional(),
    key: z.string().max(100).optional(),
  }),
]);
export const frameMessageSchema = z.object({
  type: z.enum([
    "sprout-preview-ready",
    "sprout-preview-log",
    "sprout-preview-error",
    "sprout-preview-complete",
    "sprout-preview-command",
  ]),
  runId: z.string().max(100).nullable().optional(),
  line: text.optional(),
  message: text.optional(),
  name: text.optional(),
  checks: z.array(checkResultSchema).max(100).optional(),
  command: commandSchema.optional(),
});
