import { writeGenerated } from "./write-generated.mjs";
import {
  courses,
  allLessons,
  orderedLessons,
  learningOrder,
  projects,
  challenges,
  jsStarter,
  reactStarter,
} from "../src/curriculum.js";
import { codeFingerprint, taskSignature } from "../src/learning/progress.js";
const compactLesson = (lesson) => ({
  knowledgeSignature: codeFingerprint(JSON.stringify(lesson.quiz)),
  ...Object.fromEntries(
    Object.entries(lesson).filter(([key]) =>
      [
        "id",
        "title",
        "courseId",
        "courseTitle",
        "color",
        "category",
        "minutes",
        "intro",
        "level",
        "icon",
      ].includes(key),
    ),
  ),
  teaching: {
    independent: {
      revision: lesson.teaching.independent.revision,
      signature: taskSignature(lesson.teaching.independent),
      starterFingerprint: codeFingerprint(lesson.teaching.independent.starter),
    },
  },
});
const byId = Object.fromEntries(
  allLessons.map((lesson) => [lesson.id, compactLesson(lesson)]),
);
const catalog = {
  courses: courses.map((course) => ({
    ...course,
    lessons: course.lessons.map((lesson) => byId[lesson.id]),
  })),
  allLessons: allLessons.map((lesson) => byId[lesson.id]),
  orderedLessons: orderedLessons.map((lesson) => byId[lesson.id]),
  learningOrder,
  projects,
  challenges,
  jsStarter,
  reactStarter,
};
await writeGenerated(
  "src/generated/catalog.js",
  Object.entries(catalog)
    .map(([key, value]) => `export const ${key} = ${JSON.stringify(value)};`)
    .join("\n") + "\n",
);
