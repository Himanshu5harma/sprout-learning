import { lessonEvidence } from "../features/progress/evidence";
import { ArrowRight, ArrowLeft, Bookmark, Check, Clock3 } from "lucide-react";
import { CourseIcon } from "../shared/presentation.jsx";
import { allLessons } from "../generated/catalog.js";

export default function PathsCoursePage({
  setSelectedCourse,
  currentCourse,
  progress,
  openLesson,
  toggleBookmark,
}) {
  return (
    <>
      <button
        className="text-button back-button"
        onClick={() => setSelectedCourse(null)}
      >
        <ArrowLeft size={16} />
        All learning paths
      </button>
      <div className={`course-detail-header ${currentCourse.color}`}>
        <span className={`course-icon ${currentCourse.color}`}>
          <CourseIcon course={currentCourse} size={42} />
        </span>
        <div>
          <div className="eyebrow">
            {currentCourse.category} · {currentCourse.level}
          </div>
          <h1>{currentCourse.title}</h1>
          <p>{currentCourse.description}</p>
        </div>
        <div className="detail-count">
          <strong>
            {
              currentCourse.lessons.filter((l) =>
                progress.completed.includes(l.id),
              ).length
            }
            <span> / {currentCourse.lessons.length}</span>
          </strong>
          <small>lessons completed</small>
        </div>
      </div>
      <div className="lessons-list">
        {currentCourse.lessons.map((item, i) => {
          const full = allLessons.find((l) => l.id === item.id);
          const done = progress.completed.includes(item.id);
          const evidence = lessonEvidence(progress, full);
          return (
            <div className="lesson-row" key={item.id}>
              <span className={`lesson-number ${done ? "finished" : ""}`}>
                {done ? <Check size={19} /> : String(i + 1).padStart(2, "0")}
              </span>
              <button
                className="lesson-row-title"
                onClick={() => openLesson(full)}
              >
                <h3>{item.title}</h3>
                <small className="lesson-evidence">
                  {evidence.draft ? "Saved draft · " : ""}
                  {evidence.current
                    ? evidence.assisted
                      ? "Practical check: assisted"
                      : "Practical check: independent"
                    : evidence.stale
                      ? "Practical check: recheck required"
                      : "Practical check: not yet"}
                  {evidence.knowledge ? " · Knowledge check passed" : ""}
                  {evidence.completed ? " · Completed" : ""}
                </small>
                <span>
                  <Clock3 size={12} />
                  {item.minutes} min
                  <span className="lesson-meta-dot">·</span>Explanation,
                  practice & quick check
                </span>
              </button>
              <button
                className={`icon-button ${progress.bookmarks.includes(item.id) ? "is-saved" : ""}`}
                aria-label={`${progress.bookmarks.includes(item.id) ? "Remove bookmark for" : "Bookmark"} ${item.title}`}
                onClick={() => toggleBookmark(item.id)}
              >
                <Bookmark
                  size={18}
                  fill={
                    progress.bookmarks.includes(item.id)
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
              <button className="lesson-start" onClick={() => openLesson(full)}>
                {done ? "Revisit" : "Start lesson"}
                <ArrowRight size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
