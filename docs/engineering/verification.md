# Engineering verification

Date: 2026-10-20. Local macOS, Node 22.18.0, production builds with Vite 8.3.4, Playwright Chromium. This is an engineering validation record, not an accessibility certification or a deployment report.

## Baseline and implemented stages

The starting application passed 69 existing Node tests. Its main JavaScript bundle was 1,029.27 kB raw / 323.65 kB gzip, with 88.32 kB raw / 18.04 kB gzip CSS. The deferred compiler was about 2.18 MB raw. The baseline artifacts are under ignored `output/production-upgrade/`.

Confirmed issues included native execution with browser capabilities, a bypassable mutable loop counter, unvalidated runtime/persistence data, whole-save writes on every edit, stale completion state after editing, and lost updates between tabs. These were addressed in stages: interpreter isolation and lifecycle ownership; validated transactional persistence and strict domain types; composed lazy pages and accessible design primitives; evidence/history/data controls; reproducible gates and browser coverage.

The authored curriculum remains 53 lessons and seven projects. Original IDs, original checklist indices/order, historical completions, bookmarks, and draft identities are checked against the existing legacy fixture. Lesson explanations and practical progression were retained.

## Checks performed

- A clean `npm ci` succeeded. `npm audit --audit-level=moderate` reported zero vulnerabilities in the locked dependency set.
- ESLint, including Hooks rules and dependency checks, strict TypeScript, and non-mutating Prettier checks passed.
- 79 Node tests passed, including the existing curriculum/migration checks, real isolated execution, timer errors, primitive throws, recursion/loop/dynamic-code interruptions, memory limits, output limits, and denied network/browser capabilities.
- 25 Vitest unit/component tests passed at the latest verification point. They cover transactional merges, draft/reflection conflicts, a third edit during conflict resolution, import/export alternatives, recovery journals, corrupt legacy recovery, deletion fencing, selected reset, assistance, estimated-minute merges, stale task/quiz evidence, per-editor subscriptions, keyboard tabs, field labels, invalid messages, worker startup failure, cancellation, and timeouts.
- The complete 40-test production browser suite passed.
- The production browser matrix matched all **205 JavaScript** and **173 React** execution cases, including examples, reference solutions, project flows, and intentionally incorrect starter variants. These use the same interpreter, worker, preview session, DOM adapter, and checks as the application.
- Browser journeys verified learning/completion gating after edits, accepted alternative quotation styles, bookmarks/history/reload, hints and assisted solutions, multiple-tab conflicts, fast reload recovery, legacy migration, stopping/rerunning/navigation, validated import/export/reset/delete, and offline saving in an already-loaded editor.
- Automated axe scans passed on the seven primary routes and the lesson dialog; settings/profile/search dialogs received additional contrast and keyboard checks. Identified low-contrast text and invalid read-only editor ARIA were fixed. Keyboard tests include Tab leaving the editor, arrow/Home/End tabs, Escape, focus restoration, and mobile navigation containment.
- Layout tests visited every primary route at **320, 768, 1440, and 1920 CSS pixels**, checked horizontal overflow and reachable final controls, and verified the last lesson and sidebar at a **1440 × 650** laptop viewport. Four visual baselines cover phone paths, tablet practice, laptop overview, and wide progress. Baselines were rendered and reviewed locally.
- A local browser test applied the proposed production security headers and successfully ran JavaScript and React. This emulates the policy; it does not verify Cloudflare deployment or actual response headers.

Additional focused checks verified the fingerprinted preview path under CSP and React interaction contracts, and the value checker rejects numeric-key objects and sparse arrays when an array is expected. The final complete run includes these changes and the shared scroll-lock regression.

The final integration run is recorded in `output/production-upgrade/browser-final.txt`; browser HTML reports, traces, axe findings, and performance attachments are generated under `output/`. These directories are deliberately not committed. CI runs the maintained suite rather than the former ad hoc browser scripts.

## Dialog positioning follow-up

Tailwind Preflight reset native dialog margins, placing dialogs at the top-left. The shared dialog rule now restores auto margins, including search dialogs with older top offsets. Four regression journeys check centering and viewport bounds at 320 × 640, 768 × 1024, 1440 × 650, and 1920 × 1080 across profile, goal, search, challenge, lesson, project, and confirmation dialogs. Tall challenge content is checked after scrolling. The phone check also exposed a search icon without an accessible name; it now has the label “Search lessons.”

Manual Chrome checks confirmed profile dialogs at phone/laptop sizes and centered search. Production build, lint, strict types, formatting, and the 23 targeted dialog/accessibility/responsive/visual browser checks passed. The original full execution matrix was not repeated for this CSS/label change. The follow-up browser log is `output/production-upgrade/dialog-browser.txt`.

## CI follow-up: 26 October 2026

[PR #2's original Linux Chromium job](https://github.com/Himanshu5harma/sprout-learning/actions/runs/40298792133/job/121491290401?pr=2) passed 42 of 44 browser tests. The two failures were the interactive React smoke test and the wide progress screenshot. Its trace showed `__sproutRender is not defined`: the worker accepted a render command while the asynchronous compiler/renderer import was still pending. Validated React commands now wait in a bounded startup queue, and terminal failures clear it. The preview owns the first render, so startup does not mount effects an extra time. A new regression holds the real renderer asset, sends a command during initialization, and verifies the completed preview. It failed before the fix and passed afterward. Focused contracts also cover effects and asynchronous UI updates.

The progress reference also contained older wording, and Linux full-page text wrapping differs from macOS. The current macOS reference was recaptured and reviewed. The Linux reference was taken from the downloaded CI artifact and visually reviewed against the intended current content. Only this screen needs platform-specific references; the other three shared references passed in the Linux job. The pixel comparison threshold remains unchanged. Test logs, traces, and downloaded artifacts stay in ignored `output/`.

After the fix, `npm run check` passed: 79 Node tests, 25 unit/component tests, lint, strict types, formatting, production build, and budgets. The complete macOS Chromium suite passed all 47 browser tests, including all 205 JavaScript and 173 React execution cases and the new startup/effect regressions. The logs are `output/production-upgrade/ci-fix-quality.txt` and `output/production-upgrade/ci-fix-browser-final.txt`.

The Cloudflare check reported a successful PR preview deployment. That status does not verify live runtime behaviour, production headers, or a production deployment. The corrected code still requires a new remote CI run after it is pushed. This report concerned GitHub CI viewed in Firefox; separate local Playwright Firefox attempts could not start a temporary browser profile, so no Firefox engine compatibility result is claimed.

## Performance evidence

The current initial JavaScript graph, including the overview route, is **132.78 kB gzip**, roughly **59% smaller** than the starting 324 kB. CSS is about **26 kB gzip**; it grew with Tailwind primitives and locally bundled font declarations. These figures do not represent total transfer: fonts and the deferred editor/compiler/interpreter have separate costs.

The overview browser check confirms that CodeMirror/editor code, Babel, and the WebAssembly runner are not requested initially. React renderer code is deferred inside the worker as well. A per-draft subscription regression confirms typing does not notify unrelated progress subscribers. Generated assets are written only when their contents change, and Vite ignores test/build output to preserve open editor sessions during development.

Unthrottled local browser samples recorded no long tasks while typing a short program, with reported event durations commonly 16–24 ms. Local LCP samples varied with observer timing and cache state, approximately 0.1–0.4 seconds. These are development observations, not field INP/LCP claims or a mobile network benchmark. A comparable browser timing baseline was not recorded; only bundle sizes support a before/after comparison. The build gate enforces 160,000 gzip bytes for initial JavaScript and 40,000 gzip bytes for CSS.

## Remaining limits

- TypeScript migration is incremental. Authored curriculum and some existing teaching/presentation components remain JavaScript behind validated boundaries.
- The isolated React host is a small educational renderer, using a pinned experimental reconciler integration. It supports the authored lessons, not arbitrary React DOM integrations, external packages, browser APIs, or multiple project files. See [execution security](security.md).
- The current interpreter wrapper does not expose a global unhandled-promise rejection tracker. Await/return asynchronous work; a detached rejected promise can be missed. Awaited failures, timer exceptions, and execution limits are covered.
- Memory/time/message limits intentionally reject oversized or expensive programs. Cold engine/compiler loading has a cost. Browser/OS termination, storage eviction/denial/quota, and work killed before a durable write cannot be fully prevented.
- Offline editing works once its code is loaded. There is no service worker or guarantee of a fresh offline launch or loading a previously unopened feature.
- Screen-reader speech/VoiceOver, real touch devices, slow mobile CPUs/networks, and Firefox/Safari were not fully tested. Automated axe and Chrome accessibility-tree/keyboard checks provide partial evidence toward WCAG 2.2 AA.
- The wide progress screenshot has separate reviewed macOS and Linux references; the other three are shared. A remote run of the corrected code remains required. Windows screenshot references and other browser engines are not verified.
- The original remote workflow exposed the two browser failures described above; its install, lint, types, formatting, unit tests, build, and budgets passed. Cloudflare reported a successful PR preview build, but live preview behaviour, production deployment/headers/MIME/cache behavior, remote monitoring, and cross-device account sync remain unverified. A sync backend or remote reporting service requires an explicit service/privacy/cost decision.
