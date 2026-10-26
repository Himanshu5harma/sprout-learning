import { useState } from "react";
import { allLessons, courses } from "../generated/catalog.js";
import { useProgress } from "../persistence/store";
import {
  lessonEvidence,
  type LessonSummary,
} from "../features/progress/evidence";
import { DataControls } from "../features/progress/DataControls";
import { Button, Card, Tabs } from "../ui/primitives";

export default function ProgressPage({
  openLesson,
  openCourse,
}: {
  openLesson: (lesson: LessonSummary) => void;
  openCourse: (id: string) => void;
}) {
  const [progress] = useProgress();
  const [tab, setTab] = useState("By skill");
  const lessons = allLessons as LessonSummary[];
  return (
    <div className="progress-layout">
      <div className="page-heading">
        <div>
          <div className="eyebrow">EVIDENCE OF YOUR PRACTICE</div>
          <h1>Your learning, made visible.</h1>
          <p>
            Completion is a milestone. These checks show what you practised and
            what needs another look.
          </p>
        </div>
      </div>
      <Card>
        <h2>
          {progress.completed.length} lessons completed ·{" "}
          {
            Object.values(progress.practice).filter((record) => record.passed)
              .length
          }{" "}
          practical tasks with a passed record
        </h2>
        <p>
          Historical completions stay even when code or tasks change.
          “Independent” means no solution was revealed for that attempt; the
          listed cases provide limited evidence, not a mastery score. Project
          checklist entries are self-reported.
        </p>
        <p>
          Estimated learning minutes:{" "}
          {Object.values(progress.activity).reduce(
            (sum, value) => sum + value,
            0,
          )}
          . This adds published durations for completed lessons; it does not
          measure time on the page.
        </p>
      </Card>
      <Tabs
        id="progress-view"
        panelId="progress-panel"
        items={["By skill", "Lesson evidence", "Learning history"]}
        value={tab}
        onChange={setTab}
        label="Progress views"
      />
      <div
        id="progress-panel"
        role="tabpanel"
        aria-labelledby={`progress-view-${["By skill", "Lesson evidence", "Learning history"].indexOf(tab)}`}
        tabIndex={0}
      >
        {tab === "By skill" && (
          <div className="skill-grid">
            {courses.map((course) => {
              const items = lessons.filter(
                (lesson) => lesson.courseId === course.id,
              );
              const states = items.map((lesson) =>
                lessonEvidence(progress, lesson),
              );
              const completed = states.filter((s) => s.completed).length;
              const state =
                completed === items.length
                  ? "Completed"
                  : states.some(
                        (s) =>
                          s.completed || s.draft || s.attempted || s.knowledge,
                      )
                    ? "In progress"
                    : "Not started";
              return (
                <Card key={course.id}>
                  <h2>{course.title}</h2>
                  <p>
                    <strong>{state}</strong> · {completed}/{items.length}{" "}
                    completed
                  </p>
                  <p>
                    {states.filter((s) => s.current && !s.assisted).length}{" "}
                    current independent checks ·{" "}
                    {states.filter((s) => s.current && s.assisted).length}{" "}
                    assisted · {states.filter((s) => s.stale).length} need
                    rechecking
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => openCourse(course.id)}
                  >
                    Open path
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
        {tab === "Lesson evidence" && (
          <Card>
            <h2>What is recorded for each lesson</h2>
            <ul className="evidence-list">
              {lessons.map((lesson) => {
                const state = lessonEvidence(progress, lesson);
                return (
                  <li key={lesson.id}>
                    <div>
                      <h3>{lesson.title}</h3>
                      <div className="evidence-tags">
                        <span className="evidence-tag">
                          {state.completed
                            ? "Completed · historical milestone"
                            : "Not completed"}
                        </span>
                        {state.draft && (
                          <span className="evidence-tag">Saved draft</span>
                        )}
                        <span className="evidence-tag">
                          {state.current
                            ? state.assisted
                              ? "Practical check · assisted"
                              : "Practical check · independent"
                            : state.stale
                              ? "Practical check · recheck required"
                              : state.attempted
                                ? "Practical check · needs work"
                                : "Practical check · not yet"}
                        </span>
                        <span className="evidence-tag">
                          Knowledge check ·{" "}
                          {state.knowledge ? "passed" : "not yet"}
                        </span>
                      </div>
                    </div>
                    <Button variant="quiet" onClick={() => openLesson(lesson)}>
                      Open lesson
                    </Button>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}
        {tab === "Learning history" && (
          <Card>
            <h2>Recent learning history</h2>
            {progress.history?.length ? (
              <ol className="history-list">
                {[...progress.history]
                  .reverse()
                  .slice(0, 100)
                  .map((event) => (
                    <li key={event.id}>
                      <strong>
                        {event.kind === "check"
                          ? event.passed
                            ? "Behaviour checked"
                            : "Check needs work"
                          : event.kind === "completion"
                            ? "Lesson completed"
                            : event.kind === "assistance"
                              ? "Solution viewed"
                              : event.kind === "import"
                                ? "Progress imported"
                                : "Data reset"}
                      </strong>
                      {event.assisted ? " · assisted" : ""}
                      <p>
                        {lessons.find((lesson) =>
                          event.subject.includes(lesson.id),
                        )?.title || event.subject}
                      </p>
                      <time dateTime={event.at}>
                        {new Date(event.at).toLocaleString()}
                      </time>
                    </li>
                  ))}
              </ol>
            ) : (
              <p>
                Your next check or completion will appear here. Older
                completions were preserved without inventing dates or attempts.
              </p>
            )}
          </Card>
        )}
      </div>
      <DataControls />
    </div>
  );
}
