import { z } from "zod";
import {
  guestEventSchema,
  type ExecutionResult,
  type PreviewNode,
} from "./protocol";

export type { ExecutionResult, PreviewNode };
type RuntimeEvent = z.infer<typeof guestEventSchema>;
export function createExecution({
  code,
  language,
  checks = [],
  signal,
  onEvent,
  timeoutMs = 5000,
}: {
  code: string;
  language: "JavaScript" | "React";
  checks?: unknown[];
  signal?: AbortSignal;
  onEvent: (event: RuntimeEvent) => void;
  timeoutMs?: number;
}) {
  const runId = crypto.randomUUID();
  let worker: Worker;
  try {
    if (code.length > 100000)
      throw new Error(
        "This playground runs up to 100,000 characters. Use a smaller example or a local project.",
      );
    worker = new Worker(new URL("./sandbox.worker.ts", import.meta.url), {
      type: "module",
      name: "Sprout isolated code",
    });
  } catch (error) {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled && !signal?.aborted)
        onEvent({
          type: "error",
          error:
            error instanceof Error
              ? error.message
              : "The browser could not start the isolated runner.",
          errorName: "RunnerError",
        });
    });
    return {
      dispose: () => {
        cancelled = true;
      },
      command: (_command: unknown) => {},
    };
  }
  let disposed = false;
  const lifetime = setTimeout(
    () =>
      fail(
        "The preview session ended. Run again to continue.",
        "ExecutionLimit",
      ),
    language === "React" ? 120000 : timeoutMs,
  );
  const startup = setTimeout(
    () =>
      fail(
        "The program did not finish in time. Check for a loop, recursion, or a timer that needs clearing.",
        "ExecutionLimit",
      ),
    timeoutMs,
  );
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    clearTimeout(lifetime);
    clearTimeout(startup);
    signal?.removeEventListener("abort", dispose);
    worker.onmessage = null;
    worker.onerror = null;
    worker.terminate();
  };
  function fail(error: string, errorName: string) {
    if (disposed) return;
    onEvent({ type: "error", error, errorName });
    dispose();
  }
  worker.onmessage = (message: MessageEvent<unknown>) => {
    const envelope = z
      .object({ runId: z.literal(runId), event: guestEventSchema })
      .safeParse(message.data);
    if (!envelope.success) {
      fail(
        "The execution returned an invalid message. Stop and run again.",
        "RuntimeProtocol",
      );
      return;
    }
    if (disposed) return;
    const event = envelope.data.event;
    if (event.type === "tree" || event.type === "result") clearTimeout(startup);
    onEvent(event);
    if (event.type === "error" || event.type === "result") dispose();
  };
  worker.onerror = (event) => {
    event.preventDefault();
    fail(
      "The isolated runner could not start. Reload the app and run again.",
      "RunnerError",
    );
  };
  if (signal?.aborted) dispose();
  else {
    signal?.addEventListener("abort", dispose, { once: true });
    worker.postMessage({ type: "start", runId, code, language, checks });
  }
  return {
    dispose,
    command: (command: unknown) => {
      if (!disposed) worker.postMessage(command);
    },
  };
}
export function runJavaScript(
  code: string,
  {
    checks = [],
    signal,
    timeoutMs = 5000,
  }: { checks?: unknown[]; signal?: AbortSignal; timeoutMs?: number } = {},
): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const lines: string[] = [];
    let settled = false;
    const finish = (result: ExecutionResult) => {
      if (settled) return;
      settled = true;
      signal?.removeEventListener("abort", cancel);
      resolve(result);
    };
    const cancel = () => finish({ lines: [], checks: [], cancelled: true });
    if (signal?.aborted) {
      cancel();
      return;
    }
    signal?.addEventListener("abort", cancel, { once: true });
    createExecution({
      code,
      language: "JavaScript",
      checks,
      signal,
      timeoutMs,
      onEvent: (event) => {
        if (event.type === "log") lines.push(event.line);
        if (event.type === "result") finish(event.result);
        if (event.type === "error")
          finish({
            lines,
            checks: [],
            error: event.error,
            errorName: event.errorName,
          });
      },
    });
  });
}
