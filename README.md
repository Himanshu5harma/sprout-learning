# Sprout

A beginner-friendly place to learn JavaScript and React. Built with React and Vite.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with `npm run build`, then serve it with `npm run preview`.

## What’s inside

- 44 lessons across six learning paths, from JavaScript Foundations and React Essentials to real-world JavaScript and production-minded React.
- Plain-English explanations, everyday analogies, runnable examples, and a knowledge check for each lesson.
- A JavaScript console and an interactive React/JSX playground, plus three rotating daily challenges.
- Four guided projects with personal completion checklists.
- Search, bookmarks, daily goals, learning streaks, and progress saved in browser local storage.
- Responsive layouts and native modal dialogs with keyboard navigation.

The recommended order is JavaScript Foundations → JavaScript a Little Deeper → React Essentials → React Beyond the Basics → JavaScript in the Real World → Production-minded React. All lessons remain available at any time.

## Practice environment

JavaScript examples run in a web worker with a 2.5-second execution limit. Use `console.log()` for output. DOM APIs are unavailable in the worker. Await asynchronous examples so their output is captured before execution completes.

React examples run in a sandboxed iframe using a locally bundled React runtime. Name the component `App`, or export it as default. `React` is available globally; imports from `react` are also supported. JSX compilation loads only when a React example is run. Additional packages, multiple files, full test suites, and backend services require a separate project environment.

The runtime bundle is generated automatically before `dev` and `build` by `scripts/build-preview.mjs`.

## Progress

Lesson completion requires a correct quiz answer. Estimated learning minutes use the completed lesson’s stated duration, rather than measuring elapsed screen time. Projects use self-reported checklists. Progress is local to this browser and device; clearing its storage removes saved data. No backend, account, or cloud synchronization is included.

## Content

Curriculum lives in `src/curriculum.js`; interface logic is in `src/App.jsx`; styling is in `src/styles.css`. Lessons are original explanations, with official React, MDN, and accessibility references available on the Resources page.
