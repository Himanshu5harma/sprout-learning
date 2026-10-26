# Architecture and state ownership

Sprout remains a client-rendered React/Vite application. The upgrade changes boundaries rather than introducing a server, router framework, global state library, or external account service.

## Ownership

`App.jsx` composes the shell and lazy pages. It owns navigation, the selected course, active lesson, and dialog intent. Authored content is loaded separately through a validated adapter. Page-specific rendering lives in `src/pages/`; dialogs live in `src/app/AppOverlays.jsx`. Existing teaching components remain JavaScript while new persistence, execution, progress, navigation, and shared UI code use strict TypeScript. `allowJs` is intentional; the authored curriculum and remaining presentation are not yet fully type checked. No `any` is needed in the new TypeScript modules.

The local persistence store is the source of truth for saved work. React subscribes through `useSyncExternalStore`. Drafts have subscriptions by key; typing does not notify the entire application. An editor keeps its immediate text and cursor locally and reconciles external draft updates. CodeMirror is created for an editor identity and destroyed on unmount; callbacks read current handlers without rebuilding the editor for every keystroke. Completion actions read current store data, avoiding a stale snapshot after edits.

Practice results belong to a run ID and an abort signal. A React session owns one worker and one preview frame. Cleanup removes message listeners, cancels watchdogs, terminates the worker, and invalidates callbacks. Navigation, section changes that unmount the editor, closing a lesson, stopping, resetting, rerunning, and unmount all end the previous session.

## Loading

The generated catalog contains navigation metadata and assessment signatures. Full explanations/solutions load when opening a lesson. Pages, the editor, compiler, and isolated engine are separate chunks. Babel transforms JSX inside the worker; it does not block the main thread. Fonts are bundled locally rather than requested from Google. The trusted preview adapter is emitted as a fingerprinted Vite asset so cached scripts cannot silently mix runtime protocols between releases.

`npm run check:budgets` calculates gzip sizes from the Vite build graph, including the overview route. Limits are 160,000 bytes for initial JavaScript and 40,000 bytes for initial CSS. The large JSX compiler and WebAssembly payload are deliberately deferred; first practice has a higher cost. Change budgets only with a measured explanation.

## Styling and accessibility

Tailwind's theme defines forest/ink/muted/sage/paper/line/danger colors, sans/heading/monospace families, a card radius, and shadow. Shared button variants, cards, fields, dialogs, feedback, and tabs use these tokens. Existing design CSS is placed in a `legacy` cascade layer so it cannot erase new component variants. CodeMirror and specialized responsive/teaching rules remain CSS.

Typography tokens in `responsive.css` use the browser's default root size across screen widths. Page titles have a bounded fluid size; section headings, compact card titles, body text, and supporting text have explicit roles. Wide layouts gain space without increasing every font. Progress cards use the compact title and supporting-text scales.

Every editable lab has an Expand control. `EditorWorkspace.tsx` keeps one native dialog in the document flow as a named region, then promotes that same element to a modal filling the viewport. CodeMirror and the preview iframe stay mounted, preserving undo history and running React state. Escape collapses the workspace first; dismissal of an inline workspace is passed to its containing lesson. Modal focus, boundary Tab navigation, and the shared scroll lock keep keyboard recovery predictable. This is an in-browser workspace, without requiring operating-system fullscreen permission.

Native dialogs provide focus containment and Escape, with explicit labels and focus restoration. Tabs support arrow/Home/End keys and a single active tab stop. Mobile navigation hides closed controls from keyboard navigation and traps focus while open. Dialogs and navigation share a reference-counted page scroll lock, so closing overlapping overlays in a different order cannot leave the page stuck. Focus is visible, editor Tab exits rather than inserting indentation, execution/check feedback is announced, and reduced-motion preferences are respected. These choices support WCAG 2.2 AA; test results and manual-testing limits are documented separately.

## Important tradeoffs

The custom React renderer is a deliberately small educational host. It uses real React reconciliation/hooks, but is not React DOM. Its tag/attribute/style/ref capabilities are limited. React/reconciler versions are pinned together because `react-reconciler` has an unstable integration API. The complete authored React fixture matrix must pass before changing these dependencies. DOM integration, browser APIs, external packages, routing libraries, and realistic profiling require a full local project.

Error boundaries protect the shell, page, and lesson. Console reporting includes only a fixed category and scope. There is no remote error service. If one is selected later, use opt-in reporting with explicit redaction; never capture learner code, imported data, profile names, component stacks, editor breadcrumbs, or session replay by default.
