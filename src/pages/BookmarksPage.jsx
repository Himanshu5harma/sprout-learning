import { ArrowUpRight, Bookmark } from "lucide-react";
import {
  CourseIcon,
  PageHeading,
  EmptyState,
} from "../shared/presentation.jsx";
import { courses, allLessons } from "../generated/catalog.js";

export default function BookmarksPage({
  progress,
  navigate,
  openLesson,
  toggleBookmark,
}) {
  return (
    <>
      <PageHeading
        eyebrow="GOOD THINGS ARE WORTH COMING BACK TO"
        title="Your little collection of lightbulbs."
        description="Keep the lessons you want to revisit in one easy-to-find place."
      />
      {!progress.bookmarks.length ? (
        <EmptyState
          icon={Bookmark}
          title="A little empty. Full of potential."
          description="Tap the bookmark icon in any lesson to save it here. Your future self will thank you."
          action="Find a lesson"
          onAction={() => navigate("paths")}
        />
      ) : (
        <div className="saved-lessons">
          {allLessons
            .filter((l) => progress.bookmarks.includes(l.id))
            .map((l) => (
              <div className="saved-lesson card" key={l.id}>
                <span className={`course-icon ${l.color}`}>
                  <CourseIcon
                    course={courses.find((c) => c.id === l.courseId)}
                  />
                </span>
                <button onClick={() => openLesson(l)}>
                  <span className="eyebrow">{l.courseTitle}</span>
                  <h3>{l.title}</h3>
                  <span className="muted">
                    {l.minutes} min ·{" "}
                    {progress.completed.includes(l.id)
                      ? "Completed"
                      : "Ready when you are"}
                  </span>
                </button>
                <button
                  className="icon-button is-saved"
                  aria-label={`Remove bookmark for ${l.title}`}
                  onClick={() => toggleBookmark(l.id)}
                >
                  <Bookmark size={19} fill="currentColor" />
                </button>
                <button
                  className="icon-button"
                  aria-label={`Open ${l.title}`}
                  onClick={() => openLesson(l)}
                >
                  <ArrowUpRight size={19} />
                </button>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
