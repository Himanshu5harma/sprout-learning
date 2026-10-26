import { z } from "zod";
import { lessonContentSchema, projectSchema } from "../domain/curriculum";
let promise: ReturnType<typeof importCurriculum> | undefined;
async function importCurriculum() {
  const content = await import("../curriculum.js");
  return {
    ...content,
    allLessons: z.array(lessonContentSchema).parse(content.allLessons),
    projects: z.array(projectSchema).parse(content.projects),
  };
}
export function loadCurriculum() {
  return (promise ??= importCurriculum().catch((error) => {
    promise = undefined;
    throw error;
  }));
}
