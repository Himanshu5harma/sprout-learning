import { useNavigationDrawer } from "./app/useNavigationDrawer";
import { dateKey, Logo } from "./shared/presentation.jsx";
import { ErrorBoundary } from "./ui/ErrorBoundary";

import { useProgress, getProgressStore } from "./persistence/store";
import { SaveIndicator } from "./ui/SaveIndicator";
import { loadCurriculum } from "./app/curriculum";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from "react";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Bookmark,
  ChevronRight,
  Code2,
  FolderCode,
  HelpCircle,
  Home,
  Leaf,
  Menu,
  Search,
  Sprout,
  TrendingUp,
  Library,
  X,
} from "lucide-react";
import {
  courses,
  allLessons,
  orderedLessons,
  challenges,
} from "./generated/catalog.js";
import {
  codeFingerprint,
  taskSignature,
  practiceEvidence,
} from "./learning/progress.js";

const AppOverlays = lazy(() => import("./app/AppOverlays.jsx"));
const OverviewPage = lazy(() => import("./pages/OverviewPage.jsx"));
const PathsIndexPage = lazy(() => import("./pages/PathsIndexPage.jsx"));
const PathsCoursePage = lazy(() => import("./pages/PathsCoursePage.jsx"));
const PracticePage = lazy(() => import("./pages/PracticePage.jsx"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage.jsx"));
const BookmarksPage = lazy(() => import("./pages/BookmarksPage.jsx"));
const ProgressPage = lazy(() => import("./pages/ProgressPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage.jsx"));

const pageNames = {
  overview: "Overview",
  paths: "Learning paths",
  practice: "Practice lab",
  projects: "Projects",
  bookmarks: "Bookmarks",
  progress: "My progress",
  resources: "Resources",
};
function App() {
  const [progress, setProgress] = useProgress();
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
  const [lesson, setCurrentLesson] = useState(null);
  const lessonRequest = useRef(0);
  const setLesson = useCallback((value) => {
    if (value === null) {
      lessonRequest.current++;
      getProgressStore().refreshView();
    }
    setCurrentLesson(value);
  }, []);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [sidebar, setSidebar] = useState(false);
  useNavigationDrawer(sidebar, setSidebar);
  const [toast, setToast] = useState("");
  const [labLanguage, setLabLanguage] = useState("JavaScript");
  const [labProject, setLabProject] = useState(null);
  const [profileName, setProfileName] = useState(progress.name);
  const [goalChoice, setGoalChoice] = useState(progress.dailyGoal);
  const searchRef = useRef(null);
  useEffect(
    () => () => {
      lessonRequest.current++;
    },
    [],
  );
  const today = dateKey();
  const completed = progress.completed.length;
  const verifiedLessons = allLessons.filter((item) =>
    practiceEvidence(progress, item),
  ).length;
  const totalMinutes = Object.values(progress.activity).reduce(
    (sum, n) => sum + (Number(n) || 0),
    0,
  );
  const todayMinutes = progress.activity[today] || 0;
  const nextLesson =
    orderedLessons.find(
      (item) =>
        item.id === progress.lastLesson &&
        !progress.completed.includes(item.id),
    ) || orderedLessons.find((item) => !progress.completed.includes(item.id));
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

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const handle = () => {
      const target = location.hash.slice(1);
      if (pageNames[target]) {
        getProgressStore().checkpoint();
        setLesson(null);
        setModal(null);
        setSidebar(false);
        setPage(target);
        setSelectedCourse(null);
      }
    };
    window.addEventListener("hashchange", handle);
    return () => window.removeEventListener("hashchange", handle);
  }, [setLesson]);
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
  }, [setLesson]);
  useEffect(() => {
    document.title = `Sprout — ${pageNames[page]}`;
  }, [page]);
  useEffect(() => {
    if (modal !== "search") return;
    const timeout = setTimeout(() => searchRef.current?.focus(), 40);
    return () => clearTimeout(timeout);
  }, [modal]);
  function navigate(target) {
    getProgressStore().checkpoint();
    setLesson(null);
    setPage(target);
    setSelectedCourse(null);
    setSidebar(false);
    history.pushState(null, "", `#${target}`);
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() =>
      document.getElementById("main-content")?.focus({ preventScroll: true }),
    );
  }
  function openCourse(id) {
    navigate("paths");
    setSelectedCourse(id);
  }
  async function openLesson(item) {
    if (!item) return;
    setModal(null);
    const request = ++lessonRequest.current;
    try {
      const content = await loadCurriculum();
      if (request !== lessonRequest.current) return;
      const full = content.allLessons.find((lesson) => lesson.id === item.id);
      if (full) {
        setLesson(full);
        setProgress((p) => ({ ...p, lastLesson: full.id }));
      }
    } catch {
      setToast(
        "The lesson could not load. Check your connection and try again. Your saved work is kept.",
      );
    }
  }
  function toggleBookmark(id) {
    setProgress((p) => ({
      ...p,
      bookmarks: p.bookmarks.includes(id)
        ? p.bookmarks.filter((x) => x !== id)
        : [...p.bookmarks, id],
    }));
  }
  const saveDraft = getProgressStore().saveDraft;
  function recordPractice(key, task, result) {
    setProgress((previous) => ({
      ...previous,
      history: [
        ...(previous.history || []),
        {
          id: crypto.randomUUID(),
          at: new Date().toISOString(),
          kind: "check",
          subject: key,
          passed: result.passed,
          assisted: !!previous.practice[key]?.assisted,
        },
      ].slice(-2000),
      practice: {
        ...previous.practice,
        [key]: {
          ...previous.practice[key],
          passed: result.passed,
          revision: task.revision,
          fingerprint: codeFingerprint(result.code),
          signature: taskSignature(task),
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
      history: [
        ...(previous.history || []),
        {
          id: crypto.randomUUID(),
          at: new Date().toISOString(),
          kind: "assistance",
          subject: key,
        },
      ].slice(-2000),
      practice: {
        ...previous.practice,
        [key]: { ...previous.practice[key], assisted: true },
      },
    }));
  }
  function completeLesson(quizConfirmed) {
    const latest = getProgressStore().getCurrent();
    if (
      !quizConfirmed ||
      !latest.knowledge[lesson.id]?.passed ||
      latest.knowledge[lesson.id]?.revision !== 2 ||
      latest.knowledge[lesson.id]?.signature !==
        codeFingerprint(JSON.stringify(lesson.quiz)) ||
      !practiceEvidence(latest, lesson)
    )
      return;
    if (!progress.completed.includes(lesson.id)) {
      setProgress((p) => ({
        ...p,
        completed: [...p.completed, lesson.id],
        history: [
          ...(p.history || []),
          {
            id: crypto.randomUUID(),
            at: new Date().toISOString(),
            kind: "completion",
            subject: lesson.id,
            estimatedMinutes: lesson.minutes,
            day: today,
          },
        ].slice(-2000),
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
      <aside
        id="learning-navigation"
        aria-label="Learning navigation"
        className={`sidebar ${sidebar ? "is-open" : ""}`}
      >
        <button
          className="navigation-close"
          aria-label="Close navigation"
          onClick={() => setSidebar(false)}
        >
          <X size={20} />
        </button>
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
              aria-expanded={sidebar}
              aria-controls="learning-navigation"
            >
              <Menu size={21} />
            </button>
            <span>Your learning space</span>
            <ChevronRight size={13} />
            <strong>{pageNames[page]}</strong>
          </div>
          <div className="header-actions">
            <SaveIndicator />
            <button
              className="search-trigger"
              aria-label="Search lessons"
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
          <ErrorBoundary key={page} scope="page">
            <Suspense
              fallback={
                <p className="loading-feature" role="status">
                  Opening your learning space…
                </p>
              }
            >
              {page === "overview" && (
                <OverviewPage
                  progress={progress}
                  nextLesson={nextLesson}
                  openLesson={openLesson}
                  navigate={navigate}
                  completed={completed}
                  setGoalChoice={setGoalChoice}
                  setModal={setModal}
                  todayMinutes={todayMinutes}
                  today={today}
                  totalMinutes={totalMinutes}
                  verifiedLessons={verifiedLessons}
                  filter={filter}
                  setFilter={setFilter}
                  openCourse={openCourse}
                  setLabProject={setLabProject}
                  dailyChallenge={dailyChallenge}
                />
              )}

              {page === "paths" && !currentCourse && (
                <PathsIndexPage
                  openCourse={openCourse}
                  filter={filter}
                  setFilter={setFilter}
                  progress={progress}
                />
              )}
              {page === "paths" && currentCourse && (
                <PathsCoursePage
                  setSelectedCourse={setSelectedCourse}
                  currentCourse={currentCourse}
                  progress={progress}
                  openLesson={openLesson}
                  toggleBookmark={toggleBookmark}
                />
              )}

              {page === "practice" && (
                <PracticePage
                  labProject={labProject}
                  labLanguage={labLanguage}
                  setLabLanguage={setLabLanguage}
                  setLabProject={setLabProject}
                  progress={progress}
                  setProgress={setProgress}
                  saveDraft={saveDraft}
                  recordAssistance={recordAssistance}
                  recordPractice={recordPractice}
                />
              )}

              {page === "projects" && (
                <ProjectsPage progress={progress} setModal={setModal} />
              )}

              {page === "bookmarks" && (
                <BookmarksPage
                  progress={progress}
                  navigate={navigate}
                  openLesson={openLesson}
                  toggleBookmark={toggleBookmark}
                />
              )}

              {page === "progress" && (
                <ProgressPage openLesson={openLesson} openCourse={openCourse} />
              )}

              {page === "resources" && <ResourcesPage />}
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>

      {(lesson || modal || toast) && (
        <Suspense
          fallback={
            <p className="loading-feature" role="status">
              Opening…
            </p>
          }
        >
          <AppOverlays
            lesson={lesson}
            setLesson={setLesson}
            progress={progress}
            saveDraft={saveDraft}
            recordPractice={recordPractice}
            recordAssistance={recordAssistance}
            setProgress={setProgress}
            openLesson={openLesson}
            setModal={setModal}
            toggleBookmark={toggleBookmark}
            completeLesson={completeLesson}
            modal={modal}
            searchRef={searchRef}
            search={search}
            setSearch={setSearch}
            searched={searched}
            goalChoice={goalChoice}
            setGoalChoice={setGoalChoice}
            setToast={setToast}
            profileName={profileName}
            setProfileName={setProfileName}
            navigate={navigate}
            dailyChallenge={dailyChallenge}
            startProject={startProject}
            toast={toast}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
