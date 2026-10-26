import previewRuntimeURL from "../generated/preview-runtime.js?url&no-inline";
import { createExecution } from "./client";
import { frameMessageSchema, type ExecutionResult } from "./protocol";

export function createReactSession({
  frame,
  runId,
  code,
  checks,
  signal,
  onLog,
  onResult,
  onError,
}: {
  frame: HTMLIFrameElement;
  runId: string;
  code: string;
  checks: unknown[];
  signal: AbortSignal;
  onLog: (line: string) => void;
  onResult: (result: ExecutionResult) => void;
  onError: (message: string, name?: string) => void;
}) {
  let runtime: ReturnType<typeof createExecution> | undefined;
  let ended = false;
  let disposed = false;
  const timeout = setTimeout(
    () =>
      fail(
        "The preview did not finish its checks. Check for a loop or repeated render, then run again.",
        "ExecutionLimit",
      ),
    45000,
  );
  function dispose() {
    if (disposed) return;
    disposed = true;
    clearTimeout(timeout);
    runtime?.dispose();
    window.removeEventListener("message", receive);
    signal.removeEventListener("abort", dispose);
  }
  function fail(message: string, name?: string) {
    if (disposed) return;
    onError(message, name);
    if (!ended) {
      ended = true;
      onResult({ lines: [], checks: [], error: message, errorName: name });
    }
    dispose();
  }
  function receive(event: MessageEvent<unknown>) {
    if (disposed || event.source !== frame.contentWindow) return;
    const parsed = frameMessageSchema.safeParse(event.data);
    if (!parsed.success) return;
    const data = parsed.data;
    if (data.type === "sprout-preview-ready" && !runtime) {
      runtime = createExecution({
        code,
        language: "React",
        signal,
        timeoutMs: 12000,
        onEvent: (value) => {
          if (disposed) return;
          if (value.type === "error") {
            fail(value.error, value.errorName);
            return;
          }
          frame.contentWindow?.postMessage(
            { type: "sprout-runtime-event", runId, event: value },
            "*",
          );
        },
      });
      frame.contentWindow?.postMessage(
        { type: "sprout-render", runId, checks },
        "*",
      );
      return;
    }
    if (data.runId !== runId) return;
    if (data.type === "sprout-preview-command" && data.command)
      runtime?.command(data.command);
    if (data.type === "sprout-preview-log" && data.line !== undefined)
      onLog(data.line);
    if (data.type === "sprout-preview-error")
      fail(data.message || "Preview failed", data.name);
    if (data.type === "sprout-preview-complete" && !ended) {
      ended = true;
      clearTimeout(timeout);
      onResult({ lines: [], checks: data.checks || [] });
    }
  }
  if (signal.aborted) dispose();
  else {
    signal.addEventListener("abort", dispose, { once: true });
    window.addEventListener("message", receive);
  }
  return { dispose };
}
export function previewDocument(origin: string) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${origin}; style-src 'unsafe-inline'; connect-src 'none'; img-src 'none'; form-action 'none'; base-uri 'none'"><style>body{margin:0;padding:24px;background:#fafbf8;color:#294537;font:16px/1.7 system-ui,sans-serif}h1{font-size:27px;line-height:1.3}h2{font-size:23px}button{background:#2d5541;color:white;border:0;border-radius:7px;padding:10px 15px;margin:7px 8px 7px 0;font:inherit;cursor:pointer}input{display:block;padding:9px;margin:7px 0 12px;border:1px solid #879c7d;border-radius:6px;font:inherit;max-width:90%}label{font-weight:600}li{margin:8px 0}button:disabled{opacity:.5}*:focus-visible{outline:3px solid #587b32;outline-offset:3px}[role=alert]{color:#8b3529}</style></head><body><div id="app"></div><script src="${new URL(previewRuntimeURL, origin).href}"></script></body></html>`;
}
