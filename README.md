# Sprout

Learn JavaScript and React by building small working features. Sprout keeps its soft green identity, 53 lessons, original lesson IDs, runnable practice, bookmarks, quizzes, drafts, goals, and seven project journeys.

## Develop

Use Node **22.18+ on 22.x**, or **24.11+**. Install the exact locked dependencies:

```sh
npm ci
npm run dev
```

The development/build commands generate the lightweight lesson catalog and the trusted isolated React renderer. Do not edit `src/generated/` by hand.

```sh
npm run check             # lint, strict types, non-mutating format check, tests, build, budgets
npx playwright install chromium
npm run test:browser      # production browser harness, journeys, accessibility, visual checks
```

For an intentional visual change, inspect the rendered screens before running `npx playwright test tests/browser/visual.spec.ts --update-snapshots`. Commit reviewed baselines, never failure artifacts. Browser tests use isolated profiles and their own local preview server on port 4173; they never clear your normal browser's learning data.

The PNGs in `tests/browser/__screenshots__/` are reviewed references used by visual tests. Wide progress uses its fixed 1920 × 1080 viewport so platform text wrapping cannot change the image dimensions; the other references capture full pages. Responsive and data-control journeys also check content below the fold. Actual screenshots, traces, and HTML reports stay in ignored `output/`; generated assets, build output, and dependencies are also excluded from Git.

`npm run format` formats authored files. `npm run format:check` only checks. Generated artifacts and the original compact design stylesheet are excluded from formatting.

## Learning experience

A short explanation, a working example, and one independent task form the default lesson. Longer theory, line explanations, and run/predict/change/fill/fix warmups stay optional. A practical check and a knowledge check support new completions. Existing completions remain historical milestones, even if current evidence needs rechecking.

The progress page separates saved drafts, assisted checks, independent checks, stale results, knowledge checks, and self-reported project checklists. Checks cover listed cases; they do not establish mastery. Estimated minutes add published lesson durations, rather than recording elapsed screen time. Streak encouragement is optional.

## Stack and organization

React 19, Vite 8, incremental strict TypeScript, Tailwind 4, CodeMirror 6, Zod, IndexedDB, and a QuickJS WebAssembly execution boundary. Real React runs inside the isolated interpreter through a small pinned custom renderer; learner code never executes in the browser's JavaScript realm.

- `src/content/`, `src/curriculum.js`: authored lessons and projects, with stable IDs.
- `src/domain/`: typed validation contracts.
- `src/execution/`: isolated engine, worker protocol, React adapter/session lifecycle.
- `src/persistence/`: transactional local store, draft subscriptions, conflict recovery.
- `src/pages/`, `src/features/`: focused screen and progress experiences.
- `src/app/`: navigation, lazy content loading, composed dialogs.
- `src/ui/`, `src/shared/`: accessible primitives and existing visual components.
- `src/design-system.css`: Tailwind tokens and shared variants. Specialized editor/lesson/responsive CSS remains.

See [architecture](docs/engineering/architecture.md), [execution security](docs/engineering/security.md), [saved-data compatibility](docs/engineering/persistence.md), and [verification](docs/engineering/verification.md).

## Data and deployment

Everything stays in this browser on this device. Export/import provides portable backups; it is not cloud sync. Account-based cross-device sync requires a deliberate backend, authentication, privacy, and cost decision. No service has been added.

Build with `npm run build` and serve **dist/** over HTTPS. Cloudflare Pages can use that command/output, with its production branch configured separately. `public/_headers` supplies CSP and other response headers for Pages; other hosts must apply equivalent headers. Serve `.wasm` as `application/wasm`. Keep hashed assets available through a release so already-open tabs can finish loading lazy chunks. There is no service worker or guarantee of a fresh offline load; already-loaded local editing works offline, while an unloaded lesson/editor may need a connection.

CI performs quality checks. Cloudflare reported a successful PR preview build, but live preview behaviour and a production deployment have not been verified. Check production response headers, MIME types, caching, and a fresh JS/React practice run after deploying.
