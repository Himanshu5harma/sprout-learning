# Sprout

Learn JavaScript and React by building small working features. Built with React and Vite, preserving the existing Sprout design and navigation.

## Run

Use Node 22.18+ on the 22.x line, or Node 24.11+.

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

## Learning flow

Each lesson opens with a short explanation (at most 55 words), a highlighted example, its expected result, and **Try the task**. Practice opens directly on one independent exercise. Longer explanations, syntax walkthroughs, prediction/change/fill/fix exercises, and personal explanation notes are optional.

All 53 lessons include prerequisite links, hints, explained solutions, common mistakes, and project connections. New completion requires a checked practical solution and a knowledge check. Behaviour checks accept alternative implementations and become stale when code changes. Viewing a solution marks the result as assisted. Earlier completions remain intact.

The connected shop journey progresses from product data and calculations to React controls, shared cart state, and loading/error recovery. Four original projects remain alongside three connected projects. Project checklists are self-reported; automated results are recorded separately.

The recommended sequence reaches React Essentials after core JavaScript, destructuring, and scope. Deeper async and runtime topics follow the first interface rather than delaying it.

## Playground

- JavaScript runs in a worker with a three-second limit. `console.log` prints output; returning a value does not print it. Short timers and async errors are captured. Page APIs such as `document` are unavailable.
- React runs in an opaque sandbox with locally bundled React. Name the component `App` or export it as default. JSX and imports from `react` work. Extra packages and local file imports require a full project.
- Form events work. A navigation guard explains a missing `preventDefault()` and fails the check rather than silently accepting it.
- Network, routing, lazy modules, performance, test-runner, and deployment lessons label their local models and full-project steps. The preview cannot verify a deployed system or certify professional readiness.

CodeMirror 6 provides matching syntax colours, line numbers, and dark code surfaces in examples and editable code. Tab leaves the editor; Ctrl/Cmd+Enter runs code. The JSX compiler loads when needed. The runtime is generated before `dev` and `build`.

## Saved work

The `sprout-learning-v1` key is retained. Additive migration keeps legacy lesson IDs, every draft key, bookmarks, completions, activity, goals, checklist indices, and unknown fields. It takes one original backup in `sprout-learning-backup-before-practice-v2`. Exercises use separate draft keys. Unreadable saves are retained for recovery rather than overwritten.

Storage is local to the browser, without accounts or cloud sync. Learning minutes use estimated lesson durations rather than elapsed screen time.

## Source and checks

Curriculum and concise summaries live in `src/content/`; teaching components in `src/components/`; execution and persistence in `src/learning/`. `src/styles.css` preserves the original visual design, with learning additions in `src/learning.css` and readable type/fluid layouts in `src/responsive.css`.

See [the teaching and verification record](docs/teaching-verification.md) for checks actually performed, browser rerun instructions, and remaining limits.
