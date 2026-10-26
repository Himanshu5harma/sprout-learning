import { codeFingerprint } from "../learning/progress.js";
import { CourseIcon, ModalHeader } from "../shared/presentation.jsx";
import { ErrorBoundary } from "../ui/ErrorBoundary";
import { Dialog } from "../ui/primitives";

import { lazy, Suspense } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Code2,
  Search,
  X,
  CheckCircle2,
} from "lucide-react";
import { courses, allLessons, projects } from "../generated/catalog.js";

const CodeLab = lazy(() => import("../components/CodeLab.jsx"));
const LessonTeacher = lazy(() => import("../components/LessonTeacher.jsx"));
export default function AppOverlays({
  lesson,
  setLesson,
  progress,
  saveDraft,
  recordPractice,
  recordAssistance,
  setProgress,
  openLesson,
  setModal,
  toggleBookmark,
  completeLesson,
  modal,
  searchRef,
  search,
  setSearch,
  searched,
  goalChoice,
  setGoalChoice,
  setToast,
  profileName,
  setProfileName,
  navigate,
  dailyChallenge,
  startProject,
  toast,
}) {
  return (
    <>
      {lesson && (
        <Dialog
          key={lesson.id}
          onClose={() => setLesson(null)}
          className="lesson-dialog"
          label={`Lesson: ${lesson.title}`}
        >
          <ErrorBoundary scope="lesson">
            <Suspense
              fallback={
                <p className="loading-feature" role="status">
                  Opening lesson…
                </p>
              }
            >
              <LessonTeacher
                lesson={lesson}
                progress={progress}
                saveDraft={saveDraft}
                onResult={recordPractice}
                onAssistance={recordAssistance}
                onReflection={(id, value) =>
                  setProgress((p) => ({
                    ...p,
                    reflections: { ...p.reflections, [id]: value },
                  }))
                }
                onPrediction={(id, value) =>
                  setProgress((p) => ({
                    ...p,
                    predictions: { ...p.predictions, [id]: value },
                  }))
                }
                onKnowledge={(id, value) =>
                  setProgress((p) => ({
                    ...p,
                    knowledge: {
                      ...p.knowledge,
                      [id]: {
                        ...value,
                        revision: 2,
                        signature: codeFingerprint(JSON.stringify(lesson.quiz)),
                      },
                    },
                  }))
                }
                onOpenLesson={openLesson}
                onProject={(id) => {
                  setLesson(null);
                  setModal(`project-${id}`);
                }}
                onClose={() => setLesson(null)}
                onBookmark={() => toggleBookmark(lesson.id)}
                onComplete={completeLesson}
              />
            </Suspense>
          </ErrorBoundary>
        </Dialog>
      )}
      {modal === "search" && (
        <Dialog
          onClose={() => setModal(null)}
          className="search-dialog"
          label="Search lessons"
        >
          <div className="search-input-row">
            <Search size={21} />
            <input
              ref={searchRef}
              placeholder="What would you like to understand?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search lessons"
            />
            <button
              className="icon-button"
              onClick={() => setModal(null)}
              aria-label="Close search"
            >
              <X size={19} />
            </button>
          </div>
          <div className="search-results">
            <div className="eyebrow">
              {search ? "A FEW LITTLE LIGHTBULBS" : "A GOOD PLACE TO BEGIN"}
            </div>
            {searched.length ? (
              searched.map((item) => (
                <button
                  className="search-result"
                  key={item.id}
                  onClick={() => openLesson(item)}
                >
                  <span className={`course-icon ${item.color}`}>
                    <CourseIcon
                      course={courses.find((c) => c.id === item.courseId)}
                      size={20}
                    />
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>
                      {item.courseTitle} · {item.minutes} min
                    </small>
                  </span>
                  <ArrowUpRight size={17} />
                </button>
              ))
            ) : (
              <p className="no-results">
                No lessons found. Try “state”, “functions”, or “arrays”.
              </p>
            )}
          </div>
          <div className="search-footer">
            <span>Find the idea that makes it click.</span>
            <kbd>esc to close</kbd>
          </div>
        </Dialog>
      )}
      {modal === "goal" && (
        <Dialog onClose={() => setModal(null)} label="Set your daily goal">
          <ModalHeader
            eyebrow="SMALL, STEADY STEPS"
            title="Make a little time for you."
            onClose={() => setModal(null)}
          />
          <div className="simple-modal-content">
            <p>
              Completed lessons add their estimated durations toward your daily
              goal.
            </p>
            <div
              className="goal-options"
              role="group"
              aria-label="Daily goal in estimated minutes"
            >
              {[10, 15, 30, 45].map((goal, i) => (
                <button
                  key={goal}
                  className={goalChoice === goal ? "chosen" : ""}
                  aria-pressed={goalChoice === goal}
                  onClick={() => setGoalChoice(goal)}
                >
                  <strong>{goal} min</strong>
                  <span>
                    {
                      [
                        "A little start",
                        "A steady rhythm",
                        "Room to explore",
                        "A deeper dive",
                      ][i]
                    }
                  </span>
                  {goalChoice === goal && <Check size={17} />}
                </button>
              ))}
            </div>
            <button
              className="primary-button full-width"
              onClick={() => {
                setProgress((p) => ({ ...p, dailyGoal: goalChoice }));
                setModal(null);
                setToast("Your pace, your choice. Daily goal updated.");
              }}
            >
              That’s my pace
              <Check size={16} />
            </button>
          </div>
        </Dialog>
      )}
      {modal === "profile" && (
        <Dialog onClose={() => setModal(null)} label="Your profile">
          <ModalHeader
            eyebrow="MAKE YOURSELF AT HOME"
            title="What should we call you?"
            onClose={() => setModal(null)}
          />
          <form
            className="simple-modal-content"
            onSubmit={(e) => {
              e.preventDefault();
              setProgress((p) => ({ ...p, name: profileName.trim() }));
              setModal(null);
              setToast("A little more you. Profile saved.");
            }}
          >
            <p>A name makes this little learning space feel like yours.</p>
            <label className="field-label" htmlFor="profile-name">
              Your first name
            </label>
            <input
              id="profile-name"
              className="text-input"
              placeholder="Your name"
              value={profileName}
              maxLength={24}
              onChange={(e) => setProfileName(e.target.value)}
            />
            <button className="primary-button full-width" type="submit">
              Make it mine
              <ArrowRight size={16} />
            </button>
          </form>
        </Dialog>
      )}
      {modal === "help" && (
        <Dialog onClose={() => setModal(null)} label="A little help">
          <ModalHeader
            eyebrow="YOU DON’T HAVE TO FIGURE IT ALL OUT ALONE"
            title="A little guidance goes a long way."
            onClose={() => setModal(null)}
          />
          <div className="simple-modal-content help-content">
            <h3>Where do I start?</h3>
            <p>
              Start with JavaScript Foundations. Then explore deeper JavaScript,
              React Essentials, and React Beyond the Basics. Finish with the two
              applied practice paths to practice real-world JavaScript and
              production-minded React.
            </p>
            <h3>How do lessons work?</h3>
            <p>
              Read a small example, predict it, then change, complete, and debug
              related code before writing an independent solution. New
              completions require a current independent behaviour check and a
              knowledge check. Earlier completion records are kept.
            </p>
            <h3>Where does my progress go?</h3>
            <p>
              Lessons, bookmarks, project checklists, and practice code stay in
              this browser on this device. Clearing browser storage removes
              them. No account is needed.
            </p>
            <h3>What about the practice lab?</h3>
            <p>
              JavaScript and React run in an isolated interpreter. React output
              appears in a restricted preview. The lab supports one file and
              React imports; use a full local project for external packages,
              browser APIs, and test suites.
            </p>
            <button
              className="primary-button full-width"
              onClick={() => {
                setModal(null);
                navigate("paths");
              }}
            >
              Find my first step
              <ArrowRight size={16} />
            </button>
          </div>
        </Dialog>
      )}
      {modal === "challenge" && (
        <Dialog
          onClose={() => setModal(null)}
          className="challenge-dialog"
          label="Daily coding challenge"
        >
          <ModalHeader
            eyebrow="FIVE MINUTES. ONE LITTLE WIN."
            title={dailyChallenge.title}
            onClose={() => setModal(null)}
          />
          <div className="simple-modal-content">
            <p>{dailyChallenge.description}</p>
            <p className="challenge-prerequisite">
              This practice uses array callbacks.{" "}
              {dailyChallenge.prerequisites.map((id) => (
                <button
                  className="inline-link"
                  key={id}
                  onClick={() =>
                    openLesson(allLessons.find((item) => item.id === id))
                  }
                >
                  {allLessons.find((item) => item.id === id).title}
                </button>
              ))}
              <br />
              Goal: print the requested result array. Success is checked against
              executed output. The check covers this one input, not every
              possible transformation.
            </p>
            <Suspense fallback={<p role="status">Opening editor…</p>}>
              <CodeLab
                initialCode={dailyChallenge.code}
                language="JavaScript"
                draftKey={`challenge-${dailyChallenge.id}`}
                drafts={progress.drafts}
                saveDraft={saveDraft}
                compact
                challenge={dailyChallenge}
              />
            </Suspense>
          </div>
        </Dialog>
      )}
      {modal?.startsWith("project-") &&
        (() => {
          const project = projects.find((p) => `project-${p.id}` === modal);
          return (
            project && (
              <Dialog
                onClose={() => setModal(null)}
                className="project-dialog"
                label={project.title}
              >
                <ModalHeader
                  eyebrow={`${project.category.toUpperCase()} · ${project.level.toUpperCase()} PROJECT`}
                  title={project.title}
                  onClose={() => setModal(null)}
                />
                <div className="simple-modal-content">
                  <p>{project.description}</p>
                  <h3>A few small steps to build something real</h3>
                  <p className="self-report-label">
                    These are your own checklist entries. Behaviour checks in
                    the practice lab are recorded separately.
                  </p>
                  <div className="project-prerequisites">
                    {project.prerequisites.map((id) => {
                      const item = allLessons.find(
                        (lesson) => lesson.id === id,
                      );
                      return (
                        <button
                          key={id}
                          className="prerequisite-link"
                          onClick={() => openLesson(item)}
                        >
                          {item.title}
                          <ArrowRight size={12} />
                        </button>
                      );
                    })}
                  </div>
                  <div className="project-milestones">
                    <h3>Build in this order</h3>
                    <ol>
                      {project.milestones.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="project-checklist">
                    {project.requirements.map((req, i) => (
                      <label key={i}>
                        <input
                          type="checkbox"
                          checked={!!progress.projects[project.id]?.[i]}
                          onChange={(e) =>
                            setProgress((p) => ({
                              ...p,
                              projects: {
                                ...p.projects,
                                [project.id]: {
                                  ...p.projects[project.id],
                                  [i]: e.target.checked,
                                },
                              },
                            }))
                          }
                        />
                        <span>{req}</span>
                      </label>
                    ))}
                  </div>
                  <p className="small muted">
                    This is your own building checklist. Tick each step after
                    you’ve implemented and checked it.
                  </p>
                  <button
                    className="primary-button full-width"
                    onClick={() => startProject(project)}
                  >
                    Build in the practice lab
                    <Code2 size={17} />
                  </button>
                </div>
              </Dialog>
            )
          );
        })()}
      {toast && (
        <div className="toast" role="status">
          <span>
            <CheckCircle2 size={18} />
          </span>
          {toast}
          <button
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </>
  );
}
