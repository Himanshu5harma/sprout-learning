import type { Progress } from "../../domain/progress";
import { codeFingerprint } from "../../learning/progress.js";
export interface LessonSummary {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  minutes: number;
  knowledgeSignature?: string;
  teaching: {
    independent: {
      revision: number;
      signature: string;
      starterFingerprint: string;
    };
  };
}
export function lessonEvidence(progress: Progress, lesson: LessonSummary) {
  const key = `exercise-${lesson.id}-independent`;
  const record = progress.practice[key];
  const fingerprint =
    progress.drafts[key] === undefined
      ? lesson.teaching.independent.starterFingerprint
      : codeFingerprint(progress.drafts[key]);
  const current =
    !!record?.passed &&
    record.revision === lesson.teaching.independent.revision &&
    record.signature === lesson.teaching.independent.signature &&
    record.fingerprint === fingerprint;
  return {
    completed: progress.completed.includes(lesson.id),
    draft: Object.keys(progress.drafts).some((key) => key.includes(lesson.id)),
    current,
    stale: !!record?.passed && !current,
    assisted: !!record?.assisted,
    attempted: !!record,
    knowledge:
      !!progress.knowledge[lesson.id]?.passed &&
      progress.knowledge[lesson.id]?.revision === 2 &&
      progress.knowledge[lesson.id]?.signature === lesson.knowledgeSignature,
  };
}
