import { foundations } from "./foundations.js";
import { deeperJavaScript } from "./deeper-javascript.js";
import { reactBasics } from "./react-basics.js";
import { reactAdvanced } from "./react-advanced.js";
import { appliedJavaScript } from "./applied-javascript.js";
import { appliedReact } from "./applied-react.js";
import { prepareTeaching } from "../learning/lesson-model.js";
import { lessonBriefs } from "./lesson-briefs.js";

const content = {
  "js-foundations": foundations,
  "js-deeper": deeperJavaScript,
  "react-essentials": reactBasics,
  "react-advanced": reactAdvanced,
  "js-professional": appliedJavaScript,
  "react-professional": appliedReact,
};

export function enrichCurriculum(courses) {
  const originalIds = courses.flatMap((course) =>
    course.lessons.map((lesson) => lesson.id),
  );
  for (const course of courses) {
    const originals = new Map(
      course.lessons.map((lesson) => [lesson.id, lesson]),
    );
    if (course.level === "Expert") course.level = "Applied practice";
    course.lessons = content[course.id].map((spec) => {
      const original = originals.get(spec.id) || {};
      const quiz = spec.knowledge || original.quiz;
      if (!quiz) throw new Error(`Missing knowledge check for ${spec.id}`);
      if (!lessonBriefs[spec.id])
        throw new Error(`Missing short explanation for ${spec.id}`);
      return {
        ...original,
        id: spec.id,
        title: spec.title || original.title,
        minutes: spec.minutes,
        intro: lessonBriefs[spec.id],
        code: spec.code,
        quiz,
        teaching: prepareTeaching(
          { ...spec, brief: lessonBriefs[spec.id] },
          course.category,
        ),
      };
    });
  }
  const ids = new Set(
    courses.flatMap((course) => course.lessons.map((lesson) => lesson.id)),
  );
  for (const id of originalIds)
    if (!ids.has(id)) throw new Error(`Legacy lesson ID removed: ${id}`);
  for (const course of courses)
    for (const lesson of course.lessons) {
      for (const id of lesson.teaching.prerequisites)
        if (!ids.has(id))
          throw new Error(`Unknown prerequisite ${id} for ${lesson.id}`);
    }
}
