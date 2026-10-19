# Teaching and verification record

## Changes

The original 44 lessons had quiz-only completion, unhighlighted code, missing prerequisites, and unclear execution requirements. All original IDs and project checklist indices are retained. Nine added lessons cover comparisons, arrow functions, loops, array transformations, timers, classes, React conditions/state updates, and collections.

Following feedback, the default flow is concise: one explanation of at most 55 words, a working example, expected result, and one task. Detailed explanations, line walkthroughs, prediction/change/fill/fix exercises, and personal notes are optional. Learners do not have to complete six exercises for a small concept.

Behaviour checks execute code instead of matching one source string. Hints become progressively more specific. Solutions explain their reasoning and mark the attempt as assisted. Editing the code invalidates its current evidence. Self-reported project checklists remain separate from automatic results.

Three connected shop projects develop calculation logic, shared React state, and async recovery. The four original projects and saved drafts remain available. Simplifications distinguish const reassignment from object mutation, console output from returned values, and JavaScript calculations from React rendering.

## Checks performed locally on 19 October 2026

| Check | Result and scope |
| --- | --- |
| `npm test` | 69 passing tests including nested cases. Covers migration and unreadable saves, IDs/checklists, evidence invalidation, concise summaries, prerequisite order, explanation coverage, JS examples/reference solutions, intentional mistakes, alternate implementations, async execution, and React compilation. |
| Actual browser workers | All 205 expected outcomes matched: 29 examples, 116 reference solutions, 58 intentional mistakes, two project solutions. |
| Rendered React | All 173 expected outcomes matched: 24 examples, 96 reference solutions, 48 intentional mistakes, five project solutions. Focus-sensitive cases ran separately. |
| New learner journey | Short default lesson and direct task entry, optional help, live highlighting, discussed lines, Tab leaving the editor, prediction feedback, assistance, alternative solutions, practical-plus-quiz completion, stale evidence, reload persistence. |
| Existing learner journey | Synthetic legacy migration, preserved drafts/checklist indices, no completion double-counting, interactive React, connected project boundaries, daily goals, daily challenge hints/solutions. |
| Responsive UI | Chromium at 390, 768, 1024, 1440px; editor controls and project dialogs fit. Screenshots visually reviewed. Sampled code token colours exceed 4.5:1 contrast on the editor background. |
| Short laptop windows | Sidebar Help/footer fit at 1512×820, 1280×720, and 1440×900. Verified scrolling and keyboard access at 600px height on desktop and phone, the last foundation lesson, and laptop dialog completion controls. The fixed sidebar now scrolls when needed and uses compact spacing on shorter windows. |
| Native Chrome window | Reset a viewport override that reported 828px while the visible content area was 772px. Verified the actual Chrome window at 1512×772: main footer and sidebar footer both visible, with a native window screenshot. Compact sidebar decoration now applies through 800px height. |
| Readability and wide layouts | Body text scales from 16px to 18px, code from 15px to 16px, with darker secondary text. Checked all seven main pages at 320, 390, 768, 1512, 1920, 2560, and 3440px (49 settled page checks, no horizontal page overflow). Wide course grids use four columns; projects/resources use three. Lesson/project dialogs fit phone and wide viewports. Visible editor line numbers align after increasing the font. Restored Chrome's real window sizing after viewport checks. |
| Production preview | Worker output/cancellation/errors, JSX compilation, default/named React imports and default exports, repeated form submissions, missing-preventDefault failure, recovery, persisted evidence, unsupported import feedback, no uncaught top-level page errors. |
| Production build | Succeeds. Vite reports large chunks; the compiler loads separately. |

Form checks exposed a sandbox issue: native form events needed `allow-forms`. It is enabled without `allow-same-origin`. A guard keeps accidental submission from navigating the preview and rejects that solution. Failing and corrected forms were checked in production.

## Browser reruns

Run dev on port 5173 and production preview on 4173. Use the Playwright CLI skill with isolated named profiles. Never seed synthetic legacy data in a learner's profile.

`scripts/prepare-worker-browser-checks.mjs` and `scripts/prepare-react-browser-checks.mjs` generate harnesses under `output/playwright/`. Run the worker harness and each of the nine React batches with the CLI's `run-code --filename` command on the dev origin; inspect every returned result.

The four `scripts/verify-*-browser.mjs` files export browser functions. Write an exported function's `.toString()` to a temporary harness for `run-code`. In a fresh profile, run learning, then preservation, then responsive. Run production in a separate profile on port 4173. Generated results and screenshots are ignored under `output/`.

Clear viewport overrides before leaving a browser open for the learner. A test viewport can extend past the physical window, so a page screenshot alone does not prove that its bottom is visible. Confirm the native Chrome window when investigating screen clipping.

## Limits

Checks cover stated cases, not every input or valid implementation. They do not prove unaided understanding, maintainability, accessibility, or mastery. Larger projects, HTML/CSS, Git, tooling, security, and team development require more practice.

Full-project instructions were not deployed or tested against a real backend. Real routing/history, external APIs, real module loading, performance measurement, test runners, and deployment require separate work. Browser checks used Chromium viewport emulation, without real devices, Safari/Firefox, screen readers, or a full accessibility audit. Initial bundle size remains a performance improvement opportunity.
