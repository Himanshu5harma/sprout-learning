import { buildExecutionBody, workerSource } from "./learning/execution";

export function runJavaScript(
  code,
  { checks = [], signal, timeoutMs = 3000 } = {},
) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(
      new Blob([workerSource()], { type: "text/javascript" }),
    );
    const worker = new Worker(url);
    let finished = false;
    const finish = (result) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      signal?.removeEventListener("abort", cancel);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(result);
    };
    const cancel = () => finish({ lines: [], checks: [], cancelled: true });
    const timer = setTimeout(
      () =>
        finish({
          lines: [],
          checks: [],
          errorName: "ExecutionLimit",
          error:
            "The program did not finish within 3 seconds. Check for a loop that never ends, a timer delay that is too long, or an interval that needs clearInterval().",
        }),
      timeoutMs,
    );
    if (signal?.aborted) {
      cancel();
      return;
    }
    signal?.addEventListener("abort", cancel, { once: true });
    worker.onmessage = (event) => finish(event.data);
    worker.onerror = (event) => {
      event.preventDefault();
      finish({ lines: [], checks: [], error: event.message });
    };
    worker.postMessage({ body: buildExecutionBody(code, checks) });
  });
}
