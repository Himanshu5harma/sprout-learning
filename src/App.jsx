import { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Bookmark,
  Braces,
  Check,
  ChevronRight,
  Clock3,
  Code2,
  ExternalLink,
  Flame,
  FolderCode,
  GraduationCap,
  HelpCircle,
  Home,
  Layers,
  Leaf,
  Lightbulb,
  Menu,
  Search,
  Settings2,
  Sparkles,
  Sprout,
  Target,
  Trophy,
  TrendingUp,
  X,
  Zap,
  CheckCircle2,
  Coffee,
  Heart,
  Library,
  ListTodo,
  Wallet,
} from "lucide-react";
import {
  courses,
  allLessons,
  orderedLessons,
  learningOrder,
  projects,
  challenges,
  jsStarter,
  reactStarter,
} from "./curriculum";
import CodeLab from "./components/CodeLab.jsx";
import LessonTeacher from "./components/LessonTeacher.jsx";
import {
  STORAGE_KEY,
  readStoredProgress,
  emptyProgress,
  codeFingerprint,
  practiceEvidence,
  taskIsCurrent,
} from "./learning/progress.js";

function readProgress() {
  try {
    return readStoredProgress(localStorage);
  } catch {
    return emptyProgress();
  }
}
function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function getStreak(activity) {
  const date = new Date();
  if (!activity[dateKey(date)]) date.setDate(date.getDate() - 1);
  let count = 0;
  while (activity[dateKey(date)]) {
    count++;
    date.setDate(date.getDate() - 1);
  }
  return count;
}
function Atom({ size = 28, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <circle cx="32" cy="32" r="5" fill="currentColor" />
      {[0, 60, 120].map((angle) => (
        <ellipse
          key={angle}
          cx="32"
          cy="32"
          rx="29"
          ry="11"
          stroke="currentColor"
          strokeWidth="2.8"
          transform={`rotate(${angle} 32 32)`}
        />
      ))}
    </svg>
  );
}
function CourseIcon({ course, size = 26 }) {
  if (course.icon === "js")
    return (
      <span className="js-letter" style={{ fontSize: size * 0.78 }}>
        JS
      </span>
    );
  if (course.icon === "react") return <Atom size={size + 6} />;
  if (course.icon === "layers") return <Layers size={size} strokeWidth={1.7} />;
  return <Braces size={size} strokeWidth={1.8} />;
}
function Logo() {
  return (
    <span className="brand">
      <span className="brand-icon">
        <Sprout size={27} strokeWidth={2} />
      </span>
      sprout<span className="brand-dot">.</span>
    </span>
  );
}

function HeroArt() {
  return (
    <div className="hero-art" aria-hidden="true">
      <svg viewBox="0 0 330 260" fill="none">
        <ellipse
          cx="174"
          cy="231"
          rx="122"
          ry="12"
          fill="#cbd8ba"
          opacity=".3"
        />
        <path
          d="M30 97C40 35 125 16 200 36c95 26 121 126 53 170-74 49-188 14-217-42-9-17-11-43-6-67Z"
          fill="#dce7cf"
        />
        <path
          d="M46 151c-13 7-22 21-18 34m255-78c15-7 23-21 18-35"
          stroke="#a9bb95"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
        <g transform="rotate(-7 160 130)">
          <rect
            x="55"
            y="63"
            width="224"
            height="147"
            rx="12"
            fill="#b9c9a4"
            opacity=".5"
            transform="translate(0 7)"
          />
          <rect
            x="55"
            y="63"
            width="224"
            height="147"
            rx="12"
            fill="#fffef8"
            stroke="#b7c9a5"
            strokeWidth="1.2"
          />
          <path d="M55 90h224" stroke="#e3e8dc" />
          <circle cx="69" cy="77" r="3" fill="#e7b39c" />
          <circle cx="80" cy="77" r="3" fill="#e8d28f" />
          <circle cx="91" cy="77" r="3" fill="#a6bf8c" />
          <text
            x="182"
            y="80"
            fontFamily="monospace"
            fontSize="8"
            fill="#7d8872"
          >
            a little progress.js
          </text>
          <text
            x="73"
            y="113"
            fontFamily="monospace"
            fontSize="10"
            fill="#87947d"
          >
            01
          </text>
          <text
            x="96"
            y="113"
            fontFamily="monospace"
            fontSize="10"
            fill="#657c50"
          >
            const
          </text>
          <text
            x="133"
            y="113"
            fontFamily="monospace"
            fontSize="10"
            fill="#3e5447"
          >
            you = {"{"}
          </text>
          <text
            x="73"
            y="134"
            fontFamily="monospace"
            fontSize="10"
            fill="#87947d"
          >
            02
          </text>
          <text
            x="108"
            y="134"
            fontFamily="monospace"
            fontSize="10"
            fill="#3e5447"
          >
            potential:
          </text>
          <text
            x="176"
            y="134"
            fontFamily="monospace"
            fontSize="10"
            fill="#ad8158"
          >
            'limitless'
          </text>
          <text
            x="73"
            y="155"
            fontFamily="monospace"
            fontSize="10"
            fill="#87947d"
          >
            03
          </text>
          <text
            x="96"
            y="155"
            fontFamily="monospace"
            fontSize="10"
            fill="#3e5447"
          >
            {"};"}
          </text>
          <text
            x="73"
            y="183"
            fontFamily="monospace"
            fontSize="10"
            fill="#87947d"
          >
            04
          </text>
          <text
            x="96"
            y="183"
            fontFamily="monospace"
            fontSize="10"
            fill="#657c50"
          >
            you.grow();
          </text>
          <rect x="166" y="173" width="1" height="13" fill="#49734d" />
        </g>
        <g transform="rotate(10 267 50)">
          <rect
            x="240"
            y="24"
            width="57"
            height="57"
            rx="15"
            fill="#eae6c5"
            stroke="#dedbb5"
          />
          <text
            x="252"
            y="63"
            fontFamily="Arial,sans-serif"
            fontSize="29"
            fontWeight="700"
            fill="#7c783b"
          >
            JS
          </text>
        </g>
        <g transform="rotate(-12 53 207)">
          <rect
            x="23"
            y="176"
            width="60"
            height="60"
            rx="17"
            fill="#e9f0e7"
            stroke="#c8d8c5"
          />
          <ellipse
            cx="53"
            cy="206"
            rx="22"
            ry="8"
            stroke="#588576"
            strokeWidth="1.7"
          />
          <ellipse
            cx="53"
            cy="206"
            rx="22"
            ry="8"
            stroke="#588576"
            strokeWidth="1.7"
            transform="rotate(60 53 206)"
          />
          <ellipse
            cx="53"
            cy="206"
            rx="22"
            ry="8"
            stroke="#588576"
            strokeWidth="1.7"
            transform="rotate(120 53 206)"
          />
          <circle cx="53" cy="206" r="3.3" fill="#588576" />
        </g>
        <path
          d="M265 205v-24m0 13c-17 0-23-12-21-24 15 1 24 7 21 24Zm0-9c-2-14 6-25 20-26 2 13-4 25-20 26Z"
          fill="#729866"
          stroke="#618854"
          strokeWidth="1.5"
        />
        <path d="m252 204 26-1-4 27h-17l-5-26Z" fill="#d2b899" />
        <path d="M248 202h34v6h-34z" fill="#dfc6a5" />
        <path
          d="m35 45 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Zm267 106 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z"
          fill="#96aa7c"
        />
      </svg>
    </div>
  );
}

function Dialog({ children, onClose, className = "", label }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      dialog.close();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="dialog-surface">{children}</div>
    </dialog>
  );
}

function CourseCard({ course, progress, openCourse }) {
  const count = course.lessons.filter((item) =>
    progress.completed.includes(item.id),
  ).length;
  return (
    <button
      className={`course-card ${course.color}`}
      onClick={() => openCourse(course.id)}
    >
      <div className="course-card-top">
        <span className={`course-icon ${course.color}`}>
          <CourseIcon course={course} size={29} />
        </span>
        <span className="course-level">{course.level}</span>
      </div>
      <div className="course-category">{course.tag}</div>
      <h3>{course.title}</h3>
      <p>{course.short}</p>
      <div className="course-meta">
        <span>
          <BookOpen size={13} />
          {course.lessons.length} lessons
        </span>
        <span>
          <Clock3 size={13} />
          {course.lessons.reduce((n, l) => n + l.minutes, 0)} min
        </span>
      </div>
      <div className="course-card-bottom">
        <div>
          <div className="small-progress">
            <span
              style={{ width: `${(count / course.lessons.length) * 100}%` }}
            />
          </div>
          <span>
            {count === 0
              ? "A fresh start awaits"
              : `${count} of ${course.lessons.length} completed`}
          </span>
        </div>
        <span className="course-arrow">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </button>
  );
}

function App() {
  const [progress, setProgress] = useState(readProgress);
  const [page, setPage] = useState(() => {
    const hash = location.hash.slice(1);
    return [
      "overview",
      "paths",
      "practice",
      "projects",
      "bookmarks",
      "progress",
      "resources",
    ].includes(hash)
      ? hash
      : "overview";
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filter, setFilter] = useState("All paths");
  const [lesson, setLesson] = useState(null);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [sidebar, setSidebar] = useState(false);
  const [toast, setToast] = useState("");
  const [labLanguage, setLabLanguage] = useState("JavaScript");
  const [labProject, setLabProject] = useState(null);
  const [profileName, setProfileName] = useState(progress.name);
  const [goalChoice, setGoalChoice] = useState(progress.dailyGoal);
  const searchRef = useRef(null);
  const today = dateKey();
  const completed = progress.completed.length;
  const verifiedLessons = allLessons.filter((item) =>
    practiceEvidence(progress, item),
  ).length;
  const verifiedProjects = projects.filter((project) =>
    taskIsCurrent(
      progress.practice[`project-${project.id}`],
      project.task,
      progress.drafts[`project-${project.id}`] ?? project.starter,
    ),
  ).length;
  const totalMinutes = Object.values(progress.activity).reduce(
    (sum, n) => sum + (Number(n) || 0),
    0,
  );
  const todayMinutes = progress.activity[today] || 0;
  const nextLesson = orderedLessons.find(
    (item) => !progress.completed.includes(item.id),
  );
  const dailyChallenge =
    challenges[
      Math.floor(
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
        ).getTime() / 86400000,
      ) % challenges.length
    ];
  const currentCourse = courses.find((course) => course.id === selectedCourse);
  const pageNames = {
    overview: "Overview",
    paths: "Learning paths",
    practice: "Practice lab",
    projects: "Projects",
    bookmarks: "Bookmarks",
    progress: "My progress",
    resources: "Resources",
  };
  useEffect(() => {
    if (progress.storageRecoveryRequired) {
      setToast(
        "Your saved data could not be read. It has been kept for recovery. This visit will not replace that saved data.",
      );
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      setToast(
        "Your browser could not save progress. Make space or allow local storage to keep it between visits.",
      );
    }
  }, [progress]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const handle = () => {
      const target = location.hash.slice(1);
      if (pageNames[target]) {
        setPage(target);
        setSelectedCourse(null);
      }
    };
    window.addEventListener("hashchange", handle);
    return () => window.removeEventListener("hashchange", handle);
  }, []);
  useEffect(() => {
    const handle = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setLesson(null);
        setModal("search");
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);
  useEffect(() => {
    document.title = `Sprout — ${pageNames[page]}`;
  }, [page]);
  useEffect(() => {
    if (modal === "search") setTimeout(() => searchRef.current?.focus(), 40);
  }, [modal]);
  function navigate(target) {
    setPage(target);
    setSelectedCourse(null);
    setSidebar(false);
    history.pushState(null, "", `#${target}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function openCourse(id) {
    navigate("paths");
    setSelectedCourse(id);
  }
  function openLesson(item) {
    setLesson(item);
    setModal(null);
  }
  function toggleBookmark(id) {
    setProgress((p) => ({
      ...p,
      bookmarks: p.bookmarks.includes(id)
        ? p.bookmarks.filter((x) => x !== id)
        : [...p.bookmarks, id],
    }));
  }
  function saveDraft(key, code) {
    if (key)
      setProgress((p) => ({ ...p, drafts: { ...p.drafts, [key]: code } }));
  }
  function recordPractice(key, task, result) {
    setProgress((previous) => ({
      ...previous,
      practice: {
        ...previous.practice,
        [key]: {
          ...previous.practice[key],
          passed: result.passed,
          revision: task.revision,
          fingerprint: codeFingerprint(result.code),
          checkedAt: new Date().toISOString(),
          cases:
            result.checks?.map((item) => ({
              label: item.label,
              passed: item.passed,
            })) || [],
        },
      },
    }));
  }
  function recordAssistance(key) {
    setProgress((previous) => ({
      ...previous,
      practice: {
        ...previous.practice,
        [key]: { ...previous.practice[key], assisted: true },
      },
    }));
  }
  function completeLesson(quizConfirmed) {
    if (
      !quizConfirmed ||
      !progress.knowledge[lesson.id]?.passed ||
      progress.knowledge[lesson.id]?.revision !== 2 ||
      !practiceEvidence(progress, lesson)
    )
      return;
    if (!progress.completed.includes(lesson.id)) {
      setProgress((p) => ({
        ...p,
        completed: [...p.completed, lesson.id],
        activity: {
          ...p.activity,
          [today]: (p.activity[today] || 0) + lesson.minutes,
        },
      }));
      setToast(
        "Lesson completed. Practical behaviour and knowledge checks recorded.",
      );
    }
    const next =
      orderedLessons[
        orderedLessons.findIndex((item) => item.id === lesson.id) + 1
      ];
    if (next) openLesson(next);
    else {
      setLesson(null);
      navigate("progress");
      setToast(
        "You finished every lesson. What a journey! Keep growing with the projects.",
      );
    }
  }
  function startProject(project) {
    setLabProject(project);
    setLabLanguage(project.category);
    setModal(null);
    navigate("practice");
  }
  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "paths", label: "Learning paths", icon: BookOpen },
    { id: "practice", label: "Practice lab", icon: Code2 },
    { id: "projects", label: "Projects", icon: FolderCode },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  ];
  const searched = search.trim()
    ? allLessons
        .filter((item) =>
          `${item.title} ${item.courseTitle} ${item.intro}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        )
        .slice(0, 9)
    : orderedLessons.slice(0, 5);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to learning content
      </a>
      {sidebar && (
        <div className="sidebar-shade" onClick={() => setSidebar(false)} />
      )}
      <aside className={`sidebar ${sidebar ? "is-open" : ""}`}>
        <button
          className="logo-button"
          onClick={() => navigate("overview")}
          aria-label="Sprout home"
        >
          <Logo />
        </button>
        <div className="workspace-label">A LITTLE LEARNING, EVERY DAY</div>
        <nav className="primary-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => navigate(item.id)}
              aria-current={page === item.id ? "page" : undefined}
            >
              <item.icon size={19} strokeWidth={1.7} />
              <span>{item.label}</span>
              {item.id === "practice" && (
                <span className="nav-new">TRY IT</span>
              )}
              {item.id === "bookmarks" && progress.bookmarks.length > 0 && (
                <span className="nav-count">{progress.bookmarks.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="nav-divider" />
        <div className="nav-label">YOUR GROWTH</div>
        <button
          className={`nav-item ${page === "progress" ? "active" : ""}`}
          onClick={() => navigate("progress")}
        >
          <TrendingUp size={19} strokeWidth={1.7} />
          <span>My progress</span>
        </button>
        <button
          className={`nav-item ${page === "resources" ? "active" : ""}`}
          onClick={() => navigate("resources")}
        >
          <Library size={19} strokeWidth={1.7} />
          <span>Resources</span>
          <ArrowUpRight className="nav-external" size={14} />
        </button>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <div className="note-plant">
              <Sprout size={42} strokeWidth={1.4} />
              <span className="plant-pot" />
              <span className="plant-spark spark-one">✦</span>
              <span className="plant-spark spark-two">✧</span>
            </div>
            <h4>Great things take growth.</h4>
            <p>
              You don’t have to know it all.
              <br />
              You just have to begin.
            </p>
            <button
              onClick={() =>
                nextLesson ? openLesson(nextLesson) : navigate("projects")
              }
            >
              One small step <ArrowRight size={14} />
            </button>
          </div>
          <button className="help-button" onClick={() => setModal("help")}>
            <HelpCircle size={18} />A little help?
            <ArrowUpRight size={15} />
          </button>
          <div className="sidebar-footer">
            MADE FOR YOUR NEXT CHAPTER <Leaf size={10} />
          </div>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu icon-button"
              onClick={() => setSidebar(!sidebar)}
              aria-label="Toggle navigation"
            >
              <Menu size={21} />
            </button>
            <span>Your learning space</span>
            <ChevronRight size={13} />
            <strong>{pageNames[page]}</strong>
          </div>
          <div className="header-actions">
            <button
              className="search-trigger"
              onClick={() => setModal("search")}
            >
              <Search size={16} />
              <span>Find a little inspiration…</span>
              <kbd>⌘ K</kbd>
            </button>
            <span className="header-divider" />
            <button
              className="profile-avatar"
              onClick={() => {
                setProfileName(progress.name);
                setModal("profile");
              }}
              aria-label="Edit your profile"
            >
              {progress.name ? progress.name.charAt(0).toUpperCase() : "Y"}
            </button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>
          {page === "overview" && (
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
                    From “what’s a variable?” to “I built that.” You’re in the
                    right place.
                  </p>
                </div>
                <div className="heading-note">
                  <span className="live-dot" />
                  Your pace. Your path.
                </div>
              </div>
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
                        nextLesson
                          ? openLesson(nextLesson)
                          : navigate("projects")
                      }
                    >
                      {completed
                        ? nextLesson
                          ? "Keep on growing"
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
                      <small>learning minutes</small>
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
                  value={getStreak(progress.activity)}
                  unit={getStreak(progress.activity) === 1 ? "day" : "days"}
                  label="Your learning streak"
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
                  label="Independent exercises checked"
                />
              </div>
              <div className="dashboard-bottom">
                <div className="learning-section">
                  <div className="section-heading">
                    <div>
                      <h2>A clear path. At your pace.</h2>
                      <p>Less overwhelm. More “oh, I get it now.”</p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => navigate("paths")}
                    >
                      View all paths
                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                  <div
                    className="filter-tabs"
                    aria-label="Filter learning paths"
                  >
                    {["All paths", "JavaScript", "React"].map((item) => (
                      <button
                        key={item}
                        className={filter === item ? "selected" : ""}
                        onClick={() => setFilter(item)}
                      >
                        {item === "JavaScript" && (
                          <span className="tiny-js">JS</span>
                        )}
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
                      <strong>
                        The best way to learn? Make a little mess.
                      </strong>
                      <small>
                        Your practice lab is a safe space to try, break, and
                        figure things out.
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
          )}

          {page === "paths" && !currentCourse && (
            <>
              <PageHeading
                eyebrow="A ROADMAP, NOT A RACE"
                title="Your path to “I can build that.”"
                description="Learn core JavaScript, build with React Essentials, then make your shop project. Return to deeper topics as you need them."
              />
              <div className="path-roadmap">
                {learningOrder.map((id, index) => {
                  const course = courses.find((c) => c.id === id);
                  return (
                    <button key={id} onClick={() => openCourse(id)}>
                      <span className={`roadmap-number ${course.color}`}>
                        {index + 1}
                      </span>
                      <span>
                        {course.category}
                        <strong>
                          {
                            [
                              "Lay the foundations",
                              "Understand the language",
                              "Build your first interface",
                              "Build with confidence",
                              "Think like an engineer",
                              "Prepare for real users",
                            ][index]
                          }
                        </strong>
                      </span>
                      {index < learningOrder.length - 1 && (
                        <ChevronRight size={17} />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="section-heading">
                <h2>Find your next little step</h2>
                <Filter value={filter} setValue={setFilter} />
              </div>
              <div className="all-courses-grid">
                {courses
                  .filter(
                    (course) =>
                      filter === "All paths" || course.category === filter,
                  )
                  .map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      progress={progress}
                      openCourse={openCourse}
                    />
                  ))}
              </div>
              <div className="soft-note">
                <Lightbulb size={19} />
                <p>
                  Brand new to coding? Start with{" "}
                  <button
                    className="inline-link"
                    onClick={() => openCourse("js-foundations")}
                  >
                    JavaScript Foundations
                  </button>
                  . You don’t need any special software or prior experience.
                </p>
              </div>
            </>
          )}
          {page === "paths" && currentCourse && (
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
                  return (
                    <div className="lesson-row" key={item.id}>
                      <span
                        className={`lesson-number ${done ? "finished" : ""}`}
                      >
                        {done ? (
                          <Check size={19} />
                        ) : (
                          String(i + 1).padStart(2, "0")
                        )}
                      </span>
                      <button
                        className="lesson-row-title"
                        onClick={() => openLesson(full)}
                      >
                        <h3>{item.title}</h3>
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
                      <button
                        className="lesson-start"
                        onClick={() => openLesson(full)}
                      >
                        {done ? "Revisit" : "Start lesson"}
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {page === "practice" && (
            <>
              <PageHeading
                eyebrow="YOUR SAFE SPACE TO FIGURE IT OUT"
                title={
                  labProject
                    ? labProject.title
                    : "A little code. A little confidence."
                }
                description={
                  labProject
                    ? labProject.description
                    : "Try an idea, change a line, see what happens. Learning lives in the doing."
                }
              />
              <div className="lab-heading">
                <div className="filter-tabs">
                  {["JavaScript", "React"].map((lang) => (
                    <button
                      key={lang}
                      className={labLanguage === lang ? "selected" : ""}
                      onClick={() => {
                        setLabLanguage(lang);
                        setLabProject(null);
                      }}
                    >
                      {lang === "React" ? (
                        <Atom size={16} />
                      ) : (
                        <Braces size={16} />
                      )}{" "}
                      {lang}
                    </button>
                  ))}
                </div>
                <span className="autosave">
                  <span className="live-dot" /> Your code saves on this device
                </span>
              </div>
              {labProject && (
                <div className="project-lab-brief">
                  <h3>Your building checklist</h3>
                  <p className="self-report-label">
                    Self-reported review. Checking these boxes does not run
                    tests or verify code.
                  </p>
                  <div className="project-task-detail">
                    <h3>{labProject.task.goal}</h3>
                    <p>
                      <strong>Starting information:</strong>{" "}
                      {labProject.task.starting}
                    </p>
                    <p>
                      <strong>Your task:</strong> {labProject.task.instructions}
                    </p>
                    <p>
                      <strong>Expected behaviour:</strong>{" "}
                      {labProject.task.expected}
                    </p>
                    <p>
                      <strong>Constraints:</strong>{" "}
                      {labProject.task.constraints}
                    </p>
                  </div>
                  {labProject.requirements.map((req, i) => (
                    <label key={i}>
                      <input
                        type="checkbox"
                        checked={!!progress.projects[labProject.id]?.[i]}
                        onChange={(e) =>
                          setProgress((p) => ({
                            ...p,
                            projects: {
                              ...p.projects,
                              [labProject.id]: {
                                ...p.projects[labProject.id],
                                [i]: e.target.checked,
                              },
                            },
                          }))
                        }
                      />
                      {req}
                    </label>
                  ))}
                </div>
              )}
              <CodeLab
                key={`${labLanguage}-${labProject?.id || "free"}`}
                language={labLanguage}
                initialCode={
                  labProject?.starter ??
                  (labLanguage === "React" ? reactStarter : jsStarter)
                }
                draftKey={
                  labProject ? `project-${labProject.id}` : `lab-${labLanguage}`
                }
                drafts={progress.drafts}
                saveDraft={saveDraft}
                task={labProject?.task}
                guidance={!!labProject}
                onAssistance={() =>
                  labProject && recordAssistance(`project-${labProject.id}`)
                }
                onResult={(result) =>
                  labProject &&
                  recordPractice(
                    `project-${labProject.id}`,
                    labProject.task,
                    result,
                  )
                }
              />
              <div className="soft-note">
                <Lightbulb size={19} />
                <p>
                  {labLanguage === "React"
                    ? "Name your component App or export it as default. React is available as React, and imports from react are supported. Other packages and project files are outside this small playground."
                    : "JavaScript runs separately from the page in a worker. Use console.log() to print a value. Page-changing APIs such as document and window are unavailable here. Long-running code stops automatically."}
                </p>
              </div>
            </>
          )}

          {page === "projects" && (
            <>
              <PageHeading
                eyebrow="TURN “I UNDERSTAND” INTO “I MADE THIS”"
                title="Small projects. Real proud moments."
                description="Put the pieces together. These guided builds grow with you, from a first component to a thoughtful little application."
              />
              <div className="projects-grid">
                {projects.map((project) => {
                  const done = project.requirements.filter(
                    (_, i) => progress.projects[project.id]?.[i],
                  ).length;
                  const behaviourChecked = taskIsCurrent(
                    progress.practice[`project-${project.id}`],
                    project.task,
                    progress.drafts[`project-${project.id}`] ?? project.starter,
                  );
                  const ProjectIcon =
                    project.icon === "wave"
                      ? Coffee
                      : project.icon === "tasks"
                        ? ListTodo
                        : project.icon === "budget"
                          ? Wallet
                          : Library;
                  return (
                    <button
                      key={project.id}
                      className={`project-card ${project.color}`}
                      onClick={() => setModal(`project-${project.id}`)}
                    >
                      <div className={`project-art ${project.color}`}>
                        <ProjectIcon size={58} strokeWidth={1} />
                        <span className="project-art-spark">✦</span>
                        <span className="project-art-circle" />
                      </div>
                      <div className="project-card-info">
                        <div className="project-tags">
                          <span className={`tag ${project.color}`}>
                            {project.category}
                          </span>
                          <span>{project.level}</span>
                          {behaviourChecked && (
                            <span className="tag green">
                              <CheckCircle2 size={12} />
                              Behaviour checked
                            </span>
                          )}
                          {done === project.requirements.length && (
                            <span className="tag green">
                              <Check size={12} />
                              Checklist done
                            </span>
                          )}
                        </div>
                        <h3>{project.title}</h3>
                        <p>{project.subtitle}</p>
                        <div className="project-card-footer">
                          <span>
                            {done
                              ? `${done} / ${project.requirements.length} steps marked`
                              : `${project.requirements.length} small steps`}
                          </span>
                          <span>
                            {done ? "Keep building" : "Explore project"}
                            <ArrowUpRight size={16} />
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {page === "bookmarks" && (
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
          )}

          {page === "progress" && (
            <>
              <PageHeading
                eyebrow="LOOK AT YOU GROW"
                title="Every little step adds up."
                description="Your journey is yours. Celebrate the effort, keep the curiosity, and take it one day at a time."
              />
              <div className="practice-evidence-summary">
                <strong>
                  {verifiedLessons} current independent exercises checked
                  {" · "}
                  {verifiedProjects} project behaviours checked
                </strong>
                <p>
                  Lesson completion counts are preserved from earlier versions.
                  Practical checks are separate evidence for the listed cases.
                  Project checklists are self-reported; they are not automatic
                  verification.
                </p>
              </div>
              <div className="stats-grid progress-stats">
                <Stat
                  icon={BookOpen}
                  color="green"
                  value={completed}
                  unit={`/ ${allLessons.length}`}
                  label="Lessons completed"
                />
                <Stat
                  icon={Clock3}
                  color="blue"
                  value={totalMinutes}
                  unit="min"
                  label="Estimated learning time"
                />
                <Stat
                  icon={Flame}
                  color="orange"
                  value={getStreak(progress.activity)}
                  unit="days"
                  label="Your learning streak"
                />
                <Stat
                  icon={Trophy}
                  color="purple"
                  value={
                    projects.filter((project) =>
                      project.requirements.every(
                        (_, i) => progress.projects[project.id]?.[i],
                      ),
                    ).length
                  }
                  unit={`/ ${projects.length}`}
                  label="Project checklists (self-reported)"
                />
              </div>
              <div className="growth-overview card">
                <div className="growth-title">
                  <Sprout size={36} strokeWidth={1.5} />
                  <div>
                    <h2>
                      {completed
                        ? "Good things are taking root."
                        : "Every great journey starts at zero."}
                    </h2>
                    <p>
                      {completed
                        ? `${completed} lessons behind you. So many possibilities ahead.`
                        : "Your first lesson is a small step toward something wonderful."}
                    </p>
                  </div>
                  <button
                    className="primary-button"
                    onClick={() =>
                      nextLesson ? openLesson(nextLesson) : navigate("projects")
                    }
                  >
                    {completed ? "Keep growing" : "Take the first step"}
                    <ArrowRight size={16} />
                  </button>
                </div>
                {learningOrder.map((id) => {
                  const course = courses.find((c) => c.id === id);
                  const count = course.lessons.filter((l) =>
                    progress.completed.includes(l.id),
                  ).length;
                  return (
                    <button
                      className="progress-course-row"
                      key={id}
                      onClick={() => openCourse(id)}
                    >
                      <span className={`course-icon ${course.color}`}>
                        <CourseIcon course={course} />
                      </span>
                      <strong>{course.title}</strong>
                      <div className="progress-course-bar">
                        <span
                          style={{
                            width: `${(count / course.lessons.length) * 100}%`,
                          }}
                        />
                      </div>
                      <span>
                        {count} / {course.lessons.length}
                      </span>
                      <ChevronRight size={17} />
                    </button>
                  );
                })}
              </div>
              <div className="soft-note">
                <Lightbulb size={19} />
                <p>
                  Learning time is estimated from completed lesson durations.
                  Your progress, bookmarks, and code are saved in this browser
                  on this device.
                </p>
              </div>
            </>
          )}

          {page === "resources" && (
            <>
              <PageHeading
                eyebrow="A FEW GOOD PLACES TO KEEP GROWING"
                title="A little help along the way."
                description="Thoughtfully chosen, official references for when you want to explore a little further."
              />
              <div className="resources-grid">
                {[
                  {
                    name: "The JavaScript field guide",
                    label: "MDN WEB DOCS",
                    description:
                      "A dependable reference for JavaScript syntax, built-in objects, and language concepts.",
                    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
                    icon: Braces,
                    color: "yellow",
                  },
                  {
                    name: "Learn from the React team",
                    label: "REACT DOCUMENTATION",
                    description:
                      "Interactive examples and deeper explanations, straight from the people building React.",
                    url: "https://react.dev/learn",
                    icon: Code2,
                    color: "blue",
                  },
                  {
                    name: "Build an accessible web",
                    label: "W3C WEB ACCESSIBILITY INITIATIVE",
                    description:
                      "Understand how to create interfaces that work for people with a wide range of abilities.",
                    url: "https://www.w3.org/WAI/tutorials/",
                    icon: Heart,
                    color: "purple",
                  },
                  {
                    name: "The browser is your workshop",
                    label: "MDN LEARNING AREA",
                    description:
                      "Explore HTML, CSS, developer tools, and the foundations that support your JavaScript skills.",
                    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
                    icon: GraduationCap,
                    color: "peach",
                  },
                ].map((item) => (
                  <a
                    className="resource-card card"
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className={`course-icon ${item.color}`}>
                      <item.icon size={27} strokeWidth={1.5} />
                    </span>
                    <div className="eyebrow">{item.label}</div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <span className="text-button">
                      Explore resource
                      <ExternalLink size={15} />
                    </span>
                  </a>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {lesson && (
        <Dialog
          key={lesson.id}
          onClose={() => setLesson(null)}
          className="lesson-dialog"
          label={`Lesson: ${lesson.title}`}
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
                knowledge: { ...p.knowledge, [id]: { ...value, revision: 2 } },
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
              You choose the pace. Completed lessons count toward your daily
              learning goal.
            </p>
            <div className="goal-options">
              {[10, 15, 30, 45].map((goal, i) => (
                <button
                  key={goal}
                  className={goalChoice === goal ? "chosen" : ""}
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
              JavaScript runs in an isolated worker. React examples render in a
              sandboxed preview. The lab supports one file and React imports;
              use a full local project for external packages, browser APIs, and
              test suites.
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
            <CodeLab
              initialCode={dailyChallenge.code}
              language="JavaScript"
              draftKey={`challenge-${dailyChallenge.id}`}
              drafts={progress.drafts}
              saveDraft={saveDraft}
              compact
              challenge={dailyChallenge}
            />
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
    </div>
  );
}

function PageHeading({ eyebrow, title, description }) {
  return (
    <div className="page-heading interior-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}
function Stat({ icon: Icon, color, value, unit, label, text }) {
  return (
    <div className="stat-card">
      <span className={`stat-icon ${color}`}>
        <Icon size={21} strokeWidth={1.6} />
      </span>
      <div>
        <div className={`stat-value ${text ? "stat-text" : ""}`}>
          {value}
          <span>{unit}</span>
        </div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
function Filter({ value, setValue }) {
  return (
    <div className="filter-tabs">
      {["All paths", "JavaScript", "React"].map((item) => (
        <button
          key={item}
          className={value === item ? "selected" : ""}
          onClick={() => setValue(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
function EmptyState({ icon: Icon, title, description, action, onAction }) {
  return (
    <div className="empty-state card">
      <span>
        <Icon size={38} strokeWidth={1.2} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      <button className="primary-button" onClick={onAction}>
        {action}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
function ModalHeader({ eyebrow, title, onClose }) {
  return (
    <div className="modal-heading">
      <button
        className="icon-button modal-close"
        aria-label="Close dialog"
        onClick={onClose}
      >
        <X size={21} />
      </button>
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
    </div>
  );
}
export default App;
