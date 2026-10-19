import { enrichCurriculum } from "./content/enrich-curriculum.js";
import { enrichProjects } from "./content/project-journey.js";
import { knowledgeChecks } from "./content/knowledge-checks.js";

// Stable IDs connect authored teaching content to existing learner saves.
const definitions = [
  {
    id: "js-foundations",
    title: "JavaScript Foundations",
    short: "The language of possibilities.",
    description:
      "Start from zero. Make sense of variables, functions, and the building blocks of the web.",
    category: "JavaScript",
    level: "Beginner",
    color: "yellow",
    icon: "js",
    tag: "START HERE",
    lessons: [
      "js-welcome",
      "js-types",
      "js-variables",
      "js-operators",
      "js-comparisons",
      "js-conditions",
      "js-functions",
      "js-arrow-functions",
      "js-loops",
      "js-arrays",
      "js-array-methods",
      "js-objects",
    ],
  },
  {
    id: "react-essentials",
    title: "React Essentials",
    short: "Turn ideas into interfaces.",
    description:
      "Build your first components and bring your interfaces to life, one small piece at a time.",
    category: "React",
    level: "Beginner",
    color: "blue",
    icon: "react",
    tag: "YOUR NEXT STEP",
    lessons: [
      "react-components",
      "react-jsx",
      "react-props",
      "react-events",
      "react-state",
      "react-conditions",
      "react-updates",
      "react-lists",
      "react-forms",
      "react-sharing",
    ],
  },
  {
    id: "js-deeper",
    title: "JavaScript, a Little Deeper",
    short: "Understand the why behind the code.",
    description:
      "Get comfortable with closures, asynchronous code, and the patterns behind real applications.",
    category: "JavaScript",
    level: "Intermediate",
    color: "purple",
    icon: "braces",
    tag: "LEVEL UP",
    lessons: [
      "js-destructuring",
      "js-scope",
      "js-closures",
      "js-errors",
      "js-timers",
      "js-promises",
      "js-async",
      "js-event-loop",
      "js-prototypes",
      "js-classes",
    ],
  },
  {
    id: "react-advanced",
    title: "React, Beyond the Basics",
    short: "Build with confidence.",
    description:
      "Connect systems, manage complex state, and develop the habits of a thoughtful React developer.",
    category: "React",
    level: "Advanced",
    color: "peach",
    icon: "layers",
    tag: "GROW FURTHER",
    lessons: [
      "react-effects",
      "react-refs",
      "react-reducers",
      "react-context",
      "react-custom-hooks",
      "react-performance",
      "react-async-ui",
      "react-quality",
    ],
  },
  {
    id: "js-professional",
    title: "JavaScript in the Real World",
    short: "From knowing to engineering.",
    description:
      "Handle real data, organize code, and make failure, cleanup, and testing part of your everyday practice.",
    category: "JavaScript",
    level: "Applied practice",
    color: "yellow",
    icon: "braces",
    tag: "THINK LIKE AN ENGINEER",
    lessons: [
      "js-pipelines",
      "js-collections",
      "js-modules",
      "js-fetch",
      "js-concurrency",
      "js-debounce",
      "js-testing",
    ],
  },
  {
    id: "react-professional",
    title: "Production-minded React",
    short: "Care for the whole experience.",
    description:
      "Practice resilient interfaces, deliberate architecture, responsive updates, and the decisions behind professional React applications.",
    category: "React",
    level: "Applied practice",
    color: "blue",
    icon: "layers",
    tag: "BUILD WITH INTENTION",
    lessons: [
      "react-composition",
      "react-boundaries",
      "react-transitions",
      "react-navigation",
      "react-suspense",
      "react-production-review",
    ],
  },
];
export const courses = definitions.map(({ lessons, ...metadata }) => ({
  ...metadata,
  lessons: lessons.map((id) => ({ id, quiz: knowledgeChecks[id] })),
}));
enrichCurriculum(courses);
export const allLessons = courses.flatMap((course) =>
  course.lessons.map((lesson) => ({
    ...lesson,
    courseId: course.id,
    category: course.category,
    courseTitle: course.title,
    color: course.color,
  })),
);
export const learningOrder = [
  "js-foundations",
  "js-deeper",
  "react-essentials",
  "react-advanced",
  "js-professional",
  "react-professional",
];
// Reach a working interface before the deeper async/runtime topics. Every
// prerequisite remains earlier; course navigation and stable IDs stay intact.
const coreLessons = [
  ...allLessons.filter((lesson) => lesson.courseId === "js-foundations"),
  ...["js-destructuring", "js-scope"].map((id) =>
    allLessons.find((lesson) => lesson.id === id),
  ),
  ...allLessons.filter((lesson) => lesson.courseId === "react-essentials"),
];
const coreIds = new Set(coreLessons.map((lesson) => lesson.id));
export const orderedLessons = [
  ...coreLessons,
  ...learningOrder.flatMap((id) =>
    allLessons.filter(
      (lesson) => lesson.courseId === id && !coreIds.has(lesson.id),
    ),
  ),
];

export const challenges = [
  {
    id: "double",
    title: "A little array magic",
    topic: "Array methods",
    description:
      "Take [1, 2, 3, 4] and turn it into [2, 4, 6, 8]. A tiny transformation, a big building block.",
    hint: "Use numbers.map(number => number * 2), then log the new array.",
    code: "const numbers = [1, 2, 3, 4];\n\n// Double each number using .map()\nconst doubled = numbers;\n\nconsole.log(doubled);",
    expected: [2, 4, 6, 8],
    solution:
      "const numbers = [1, 2, 3, 4];\nconst doubled = numbers.map((number) => number * 2);\nconsole.log(doubled);",
    solutionExplanation:
      "map calls the callback for every number and collects its doubled result in a new array.",
    prerequisites: ["js-array-methods"],
  },
  {
    id: "filter",
    title: "Keep the little things",
    topic: "Array methods",
    description:
      "From [3, 8, 12, 5, 20], keep only numbers smaller than 10. Log your new array.",
    hint: "Use numbers.filter(number => number < 10).",
    code: "const numbers = [3, 8, 12, 5, 20];\n\n// Keep only numbers smaller than 10\nconst small = numbers;\n\nconsole.log(small);",
    expected: [3, 8, 5],
    solution:
      "const numbers = [3, 8, 12, 5, 20];\nconst small = numbers.filter((number) => number < 10);\nconsole.log(small);",
    solutionExplanation:
      "filter keeps each original number whose comparison is true, preserving input order.",
    prerequisites: ["js-array-methods"],
  },
  {
    id: "names",
    title: "Get to know your objects",
    topic: "Objects & arrays",
    description:
      'Turn these learner objects into an array of names: ["Sam", "Alex", "Jo"].',
    hint: "Use learners.map(learner => learner.name).",
    code: 'const learners = [\n  { name: "Sam" },\n  { name: "Alex" },\n  { name: "Jo" }\n];\n\n// Collect the names in a new array\nconsole.log(learners);',
    expected: ["Sam", "Alex", "Jo"],
    solution:
      'const learners = [{ name: "Sam" }, { name: "Alex" }, { name: "Jo" }];\nconst names = learners.map((learner) => learner.name);\nconsole.log(names);',
    solutionExplanation:
      "The callback reads one object property. map collects those returned names in their original order.",
    prerequisites: ["js-array-methods", "js-objects"],
  },
];

// Original project IDs, checklist order, and draft keys are preserved.
export const projects = [
  {
    id: "greeting",
    title: "A greeting, with a little personality",
    subtitle: "Your first interactive component",
    category: "React",
    level: "Beginner",
    color: "blue",
    icon: "wave",
    description:
      "Build a friendly welcome card that greets someone by name. Use a controlled input to turn a static component into a personal little experience.",
    requirements: [
      "Add a visible label and a name input.",
      "Store the name in React state.",
      "Display a greeting that updates as the user types.",
      "Show a friendly fallback when the input is empty.",
    ],
    starter:
      'function App() {\n  const [name, setName] = React.useState("");\n  return <div>\n    <h1>Your welcome card</h1>\n    {/* Add a labeled input and a personal greeting. */}\n  </div>;\n}',
  },
  {
    id: "tasks",
    title: "Pocket tasks",
    subtitle: "A home for the things to do",
    category: "React",
    level: "Intermediate",
    color: "purple",
    icon: "tasks",
    description:
      "Create a small task manager. Practice forms, immutable arrays, stable IDs, and conditional rendering in an app you can use every day.",
    requirements: [
      "Add a task through a labeled form.",
      "Give every task a stable ID.",
      "Toggle a task between active and completed.",
      "Delete a task without mutating the original array.",
      "Display a helpful empty state.",
    ],
    starter:
      'function App() {\n  const [tasks, setTasks] = React.useState([]);\n  const [text, setText] = React.useState("");\n  return <div>\n    <h1>Pocket tasks</h1>\n    <p>{tasks.length} tasks on your list</p>\n    {/* Add your form and task list here. */}\n  </div>;\n}',
  },
  {
    id: "budget",
    title: "Make every number count",
    subtitle: "Your JavaScript budget buddy",
    category: "JavaScript",
    level: "Intermediate",
    color: "yellow",
    icon: "budget",
    description:
      "Use arrays and functions to make sense of a simple budget. Work in the console first: good data logic is the foundation of a good interface.",
    requirements: [
      "Represent expenses as objects with a name and amount.",
      "Calculate the total with reduce.",
      "Filter expenses over a chosen amount.",
      "Write a reusable function that returns the remaining budget.",
      "Handle an empty expense list correctly.",
    ],
    starter:
      'const budget = 100;\nconst expenses = [\n  { name: "Coffee", amount: 5 },\n  { name: "Books", amount: 25 }\n];\n\n// Calculate the total and remaining budget.\nconsole.log(expenses);',
  },
  {
    id: "library",
    title: "Your little reading corner",
    subtitle: "A thoughtful, polished React app",
    category: "React",
    level: "Advanced",
    color: "peach",
    icon: "library",
    description:
      "Combine your skills in a searchable reading list. Design clear states, reusable components, keyboard-friendly forms, and a maintainable state model. Use local sample data in this playground; persistent storage can be added in your own project.",
    requirements: [
      "Create a reusable book card with stable keys.",
      "Add a controlled search input.",
      "Use a reducer to add, remove, and favorite books.",
      "Provide useful empty and no-results states.",
      "Check all interactions using only the keyboard.",
      "Write down three user behavior tests to automate in a full project.",
    ],
    starter:
      'function App() {\n  const [query, setQuery] = React.useState("");\n  const books = [\n    { id: 1, title: "The Little Prince", favorite: false },\n    { id: 2, title: "A Book of Small Things", favorite: false }\n  ];\n  return <div>\n    <h1>Your little reading corner</h1>\n    {/* Build your searchable library. */}\n  </div>;\n}',
  },
];
enrichProjects(projects);

export const jsStarter = 'console.log("Tea");';
export const reactStarter =
  "function App() {\n  return <h1>Your first shop</h1>;\n}";
