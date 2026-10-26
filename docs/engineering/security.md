# Execution trust boundary

Learner programs are untrusted. A same-origin Web Worker isolates CPU work from the interface but normally retains network and storage capabilities. An opaque iframe protects the parent DOM but can still expose browser capabilities and navigate itself. Neither is the primary security boundary in this implementation.

## Interpreter isolation

Both JavaScript and compiled React code execute inside a **QuickJS WebAssembly interpreter in a dedicated worker**. They do not run through a native browser `eval`/`Function`. Guest `eval`, `Function`, constructors, recursion, and loops stay inside the interpreter. The VM has no browser global objects, storage, workers, messaging, module loader, sockets, or network bindings.

The only host bindings carry bounded JSON output, bounded timers, and cancellation. Literal `data:application/json,` responses support the existing fetch lesson without granting network access. A promise/timer pump supports authored asynchronous examples. Per-entry interruption, a 64 MiB guest heap, a 512 KiB guest stack, pending-job batches, output/message limits, a maximum 100 host timers, startup/total watchdogs, and worker termination bound work. JavaScript normally has a five-second overall watchdog; an interactive React preview expires after two minutes. A slow first React compiler/engine load has a longer startup allowance. Interruption includes dynamically created loops, independently of the old source-level loop guard.

Awaited promises and timer exceptions surface as errors. The current QuickJS wrapper does not expose a global unhandled-promise rejection tracker: a detached rejected promise may not be reported. Await or return asynchronous exercise work; this is a documented execution limitation, rather than a simulated browser guarantee.

React host commands wait until the compiler and renderer finish initializing. The startup queue accepts at most 100 validated commands and is cleared on a terminal initialization error; the existing worker startup watchdog and cancellation still apply. The preview requests the first render, so loading the renderer does not mount effects an extra time.

WebAssembly/interpreter/browser bugs remain part of the trusted computing base. These limits cannot guarantee availability if the browser or OS itself stalls, kills a tab, or exhausts resources outside the guest. The preview is a teaching tool, not a hostile-code hosting service, credential boundary, or high-stakes examination/anti-cheat system. Learners control their own files and progress exports; checks are not attestations.

## React rendering

A trusted bundle of React and the pinned reconciler runs **inside the same VM as learner code**. It emits bounded JSON trees and accepts only sanitized event data. Guest refs expose a small focus capability, not real DOM nodes, events, browser globals, or React DOM fibers.

A trusted DOM adapter in an opaque iframe applies validated trees using text nodes, permitted HTML tags, permitted attributes, and a limited style allowlist. Scripts, frames, embedded resources, HTML injection, URLs, resource loading, native navigation props, and arbitrary styles are not permitted. Native form events are enabled so authored form lessons work; the adapter always prevents default submission, and reports missing learner `preventDefault()` as a failed check. The frame also has a restrictive CSP (`connect-src 'none'`, `form-action 'none'`, no images or external assets). No learner program executes in that frame.

Runtime messages validate nested types and sizes and match both the source frame and run ID. Late/cancelled messages are ignored. Terminal errors cannot be replaced by a later success message. Each behaviour check resets the component before performing its listed interactions; the final fresh preview remains interactive until stopped or expired.

## Hosting

Cloudflare Pages should serve `public/_headers` from the built output. Its CSP allows self-hosted scripts/workers/fonts and WebAssembly compilation, without native JavaScript `unsafe-eval`. Inline styles remain necessary for CodeMirror and React style examples. No remote fonts, analytics, or code-reporting service is configured. HTTPS, correct WebAssembly MIME type, cache/release compatibility, and the actual deployed headers require a deployment check. Local Vite preview does not automatically apply Pages `_headers`; a browser regression test emulates them without claiming a real deployment passed.

Primary upstream references: [QuickJS wrapper](https://github.com/justjake/quickjs-emscripten), [React reconciler integration](https://github.com/facebook/react/tree/main/packages/react-reconciler), [Cloudflare Pages headers](https://developers.cloudflare.com/pages/configuration/headers/).
