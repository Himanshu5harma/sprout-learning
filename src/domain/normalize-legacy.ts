import { z } from "zod";
import { progressSchema, type Progress } from "./progress";
const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
function salvage(schema: z.core.$ZodType, value: unknown): unknown {
  const result = z.safeParse(schema, value);
  if (result.success) return result.data;
  if (schema instanceof z.ZodOptional) return salvage(schema.unwrap(), value);
  if (schema instanceof z.ZodRecord && record(value))
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, item]) => {
        if (!z.safeParse(schema.keyType, key).success) return [];
        const recovered = salvage(schema.valueType, item);
        return recovered === undefined ? [] : [[key, recovered]];
      }),
    );
  if (schema instanceof z.ZodArray && Array.isArray(value))
    return value.flatMap((item) => {
      const recovered = salvage(schema.element, item);
      return recovered === undefined ? [] : [recovered];
    });
  return undefined;
}
// Salvage readable legacy entries without rewriting the original localStorage source.
export function normalizeLegacy(value: unknown, fallback: Progress): Progress {
  const source = record(value) ? value : {};
  const next = { ...source };
  const warnings: string[] = [];
  for (const [field, schema] of Object.entries(progressSchema.shape)) {
    const parsed = schema.safeParse(source[field]);
    if (parsed.success) {
      next[field] = parsed.data;
      continue;
    }
    warnings.push(field);
    let recovered = salvage(schema, source[field]);
    if (field === "history" && Array.isArray(recovered))
      recovered = recovered.slice(-2000);
    next[field] = schema.safeParse(recovered).success
      ? recovered
      : fallback[field];
  }
  if (warnings.length) next.storageValidationWarnings = warnings;
  return progressSchema.parse(next);
}
