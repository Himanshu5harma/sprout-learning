import { lessonEvidence } from "../features/progress/evidence";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Braces,
  Clock3,
  Layers,
  Sprout,
  X,
} from "lucide-react";

export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getStreak(activity) {
  const date = new Date();
  if (!activity[dateKey(date)]) date.setDate(date.getDate() - 1);
  let count = 0;
  while (activity[dateKey(date)]) {
    count++;
    date.setDate(date.getDate() - 1);
  }
  return count;
}

export function Atom({ size = 28, ...props }) {
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

export function CourseIcon({ course, size = 26 }) {
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

export function Logo() {
  return (
    <span className="brand">
      <span className="brand-icon">
        <Sprout size={27} strokeWidth={2} />
      </span>
      sprout<span className="brand-dot">.</span>
    </span>
  );
}

export function HeroArt() {
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

export function CourseCard({ course, progress, openCourse }) {
  const count = course.lessons.filter((item) =>
    progress.completed.includes(item.id),
  ).length;
  const started = course.lessons.some((lesson) => {
    const evidence = lessonEvidence(progress, lesson);
    return (
      evidence.draft ||
      evidence.attempted ||
      evidence.knowledge ||
      evidence.completed
    );
  });
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
              ? started
                ? "In progress"
                : "Not started"
              : count === course.lessons.length
                ? "Completed"
                : `In progress · ${count} of ${course.lessons.length} completed`}
          </span>
        </div>
        <span className="course-arrow">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </button>
  );
}

export function PageHeading({ eyebrow, title, description }) {
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

export function Stat({ icon: Icon, color, value, unit, label, text }) {
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

export function Filter({ value, setValue }) {
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

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  onAction,
}) {
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

export function ModalHeader({ eyebrow, title, onClose }) {
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
