import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Braces,
  Check,
  Clock3,
  Code2,
  Flame,
  Settings2,
  Sparkles,
  Sprout,
  Target,
  Zap,
  Heart,
} from "lucide-react";
import {
  dateKey,
  getStreak,
  Atom,
  HeroArt,
  CourseCard,
  Stat,
} from "../shared/presentation.jsx";
import { courses, allLessons } from "../generated/catalog.js";

export default function OverviewPage({
  progress,
  nextLesson,
  openLesson,
  navigate,
  completed,
  setGoalChoice,
  setModal,
  todayMinutes,
  today,
  totalMinutes,
  verifiedLessons,
  filter,
  setFilter,
  openCourse,
  setLabProject,
  dailyChallenge,
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow greeting">
            YOUR NEXT CHAPTER STARTS HERE <span>✦</span>
          </div>
          <h1>
            {progress.name
              ? `Keep growing, ${progress.name}.`
              : "A little learning. A lot of possibility."}
          </h1>
          <p>
            From “what’s a variable?” to “I built that.” You’re in the right
            place.
          </p>
        </div>
        <div className="heading-note">
          <span className="live-dot" />
          Your pace. Your path.
        </div>
      </div>
      {progress.lastLesson && (
        <section className="ui-card">
          <h2>Your next step</h2>
          <p>
            {nextLesson
              ? nextLesson.title
              : "Apply your learning in a project."}
          </p>
          <div className="progress-actions">
            <button
              className="ui-button ui-button-secondary"
              onClick={() =>
                nextLesson ? openLesson(nextLesson) : navigate("projects")
              }
            >
              Resume your learning
            </button>
            <button
              className="ui-button ui-button-quiet"
              onClick={() => navigate("progress")}
            >
              See recent activity
            </button>
          </div>
          {progress.history?.length > 0 && (
            <p>
              Last activity:{" "}
              {progress.history[progress.history.length - 1].kind} ·{" "}
              {new Date(
                progress.history[progress.history.length - 1].at,
              ).toLocaleDateString()}
            </p>
          )}
        </section>
      )}
      <div className="dashboard-top">
        <section className="welcome-card">
          <div className="welcome-content">
            <span className="hero-label">
              <Sprout size={15} /> SMALL STEPS. REAL SKILLS.
            </span>
            <h2>
              You don’t need to be an expert.
              <br />
              You just need a beginning.
            </h2>
            <p>
              Learn JavaScript. Make things with React.
              <br />
              Build your confidence, one little win at a time.
            </p>
            <button
              className="primary-button"
              onClick={() =>
                nextLesson ? openLesson(nextLesson) : navigate("projects")
              }
            >
              {completed
                ? nextLesson
                  ? "Resume learning"
                  : "Build something new"
                : "Let’s start learning"}
              <ArrowRight size={16} />
            </button>
            <div className="hero-caption">
              No experience needed. Just a little curiosity.
            </div>
          </div>
          <HeroArt />
        </section>
        <section className="daily-goal card">
          <div className="section-card-header">
            <h3>
              <Target size={16} /> Your daily goal
            </h3>
            <button
              className="icon-button"
              aria-label="Edit daily learning goal"
              onClick={() => {
                setGoalChoice(progress.dailyGoal);
                setModal("goal");
              }}
            >
              <Settings2 size={16} />
            </button>
          </div>
          <div
            className="goal-ring"
            style={{
              "--ring-progress": `${Math.min(todayMinutes / progress.dailyGoal, 1) * 100}%`,
            }}
          >
            <div>
              <strong>
                {todayMinutes}
                <span> / {progress.dailyGoal}</span>
              </strong>
              <small>estimated minutes</small>
            </div>
          </div>
          <p>
            {todayMinutes >= progress.dailyGoal
              ? "Your daily goal is blooming. Well done!"
              : "A little consistency goes a long way."}
          </p>
          <div className="week-dots">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              const offset = (date.getDay() + 6) % 7;
              date.setDate(date.getDate() - offset + i);
              const done = !!progress.activity[dateKey(date)];
              return (
                <div key={i}>
                  <span
                    className={`${dateKey(date) === today ? "today" : ""} ${done ? "done" : ""}`}
                  >
                    {done ? (
                      <Check size={12} />
                    ) : (
                      ["M", "T", "W", "T", "F", "S", "S"][i]
                    )}
                  </span>
                  {dateKey(date) === today && <i />}
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <div className="stats-grid">
        <Stat
          icon={BookOpen}
          color="green"
          value={completed}
          unit={`/ ${allLessons.length}`}
          label="Lessons completed"
        />
        <Stat
          icon={Flame}
          color="orange"
          value={
            progress.streaksEnabled
              ? getStreak(progress.activity)
              : (progress.history || []).filter(
                  (event) => event.kind === "check",
                ).length
          }
          unit={progress.streaksEnabled ? "days" : "checks"}
          label={
            progress.streaksEnabled
              ? "Optional learning streak"
              : "Recent practice attempts"
          }
        />
        <Stat
          icon={Clock3}
          color="blue"
          value={totalMinutes}
          unit="min"
          label="Estimated learning time"
        />
        <Stat
          icon={Sprout}
          color="purple"
          value={verifiedLessons}
          unit={`/ ${allLessons.length}`}
          label="Current practical checks"
        />
      </div>
      <div className="dashboard-bottom">
        <div className="learning-section">
          <div className="section-heading">
            <div>
              <h2>A clear path. At your pace.</h2>
              <p>Less overwhelm. More “oh, I get it now.”</p>
            </div>
            <button className="text-button" onClick={() => navigate("paths")}>
              View all paths
              <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="filter-tabs" aria-label="Filter learning paths">
            {["All paths", "JavaScript", "React"].map((item) => (
              <button
                key={item}
                className={filter === item ? "selected" : ""}
                onClick={() => setFilter(item)}
              >
                {item === "JavaScript" && <span className="tiny-js">JS</span>}
                {item === "React" && <Atom size={16} />}
                {item}
              </button>
            ))}
          </div>
          <div className="courses-grid">
            {courses
              .filter(
                (course) =>
                  filter === "All paths" || course.category === filter,
              )
              .slice(0, 3)
              .map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  progress={progress}
                  openCourse={openCourse}
                />
              ))}
          </div>
          <button
            className="practice-banner"
            onClick={() => {
              setLabProject(null);
              navigate("practice");
            }}
          >
            <span className="practice-banner-icon">
              <Code2 size={26} strokeWidth={1.4} />
            </span>
            <span>
              <strong>The best way to learn? Make a little mess.</strong>
              <small>
                Your practice lab is a safe space to try, break, and figure
                things out.
              </small>
            </span>
            <span className="practice-banner-action">
              Open the lab <ArrowRight size={16} />
            </span>
          </button>
        </div>
        <aside className="dashboard-aside">
          <section className="challenge-card card">
            <div className="challenge-label">
              <Zap size={15} /> THE DAILY LITTLE CHALLENGE
            </div>
            <span className="challenge-illustration">
              <Braces size={37} strokeWidth={1.25} />
              <Sparkles className="challenge-spark" size={18} />
            </span>
            <h3>{dailyChallenge.title}</h3>
            <p>{dailyChallenge.description}</p>

            <div className="challenge-meta">
              <span>
                <Clock3 size={13} />5 min
              </span>
              <span className="tag green">Array practice</span>
            </div>
            <button
              className="outline-button"
              onClick={() => setModal("challenge")}
            >
              Give it a little try <ArrowRight size={15} />
            </button>
          </section>
          <div className="small-encouragement">
            <span>
              <Heart size={16} strokeWidth={1.5} />
            </span>
            <p>
              Progress isn’t always a straight line.
              <br />
              <strong>Showing up is a pretty good start.</strong>
            </p>
          </div>
        </aside>
      </div>
      <div className="page-footer">
        <span>A little better than yesterday. That’s enough.</span>
        <span>
          GROW AT YOUR OWN PACE <Sprout size={13} />
        </span>
      </div>
    </>
  );
}
