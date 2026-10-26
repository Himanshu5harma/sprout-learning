import { afterEach, expect, it, vi } from "vitest";
import { createExecution, runJavaScript } from "../../src/execution/client";
class FakeWorker {
  static instances: FakeWorker[] = [];
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  terminate = vi.fn();
  postMessage = vi.fn();
  constructor() {
    FakeWorker.instances.push(this);
  }
}
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  FakeWorker.instances = [];
});
it("abort terminates the worker and suppresses already queued messages", () => {
  vi.stubGlobal("Worker", FakeWorker);
  const controller = new AbortController();
  const onEvent = vi.fn();
  createExecution({
    code: "while(true){}",
    language: "JavaScript",
    signal: controller.signal,
    onEvent,
  });
  const worker = FakeWorker.instances[0];
  const receive = worker.onmessage!;
  const runId = worker.postMessage.mock.calls[0][0].runId;
  controller.abort();
  expect(worker.terminate).toHaveBeenCalledTimes(1);
  receive(
    new MessageEvent("message", {
      data: {
        runId,
        event: { type: "result", result: { lines: ["stale"], checks: [] } },
      },
    }),
  );
  expect(onEvent).not.toHaveBeenCalled();
});
it("invalid nested results end the run with a protocol error", () => {
  vi.stubGlobal("Worker", FakeWorker);
  const onEvent = vi.fn();
  createExecution({ code: "", language: "JavaScript", onEvent });
  const worker = FakeWorker.instances[0];
  const runId = worker.postMessage.mock.calls[0][0].runId;
  worker.onmessage!(
    new MessageEvent("message", {
      data: {
        runId,
        event: {
          type: "result",
          result: { lines: [], checks: [{ label: "case", passed: "yes" }] },
        },
      },
    }),
  );
  expect(onEvent).toHaveBeenCalledWith(
    expect.objectContaining({ errorName: "RuntimeProtocol" }),
  );
  expect(worker.terminate).toHaveBeenCalled();
});
it("timeout and worker startup failures resolve as understandable errors", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("Worker", FakeWorker);
  const result = runJavaScript("while(true){}", { timeoutMs: 100 });
  await vi.advanceTimersByTimeAsync(101);
  expect(await result).toMatchObject({ errorName: "ExecutionLimit" });
  expect(FakeWorker.instances[0].terminate).toHaveBeenCalled();
  vi.stubGlobal(
    "Worker",
    class {
      constructor() {
        throw new Error("Worker unavailable");
      }
    },
  );
  expect(await runJavaScript("")).toMatchObject({
    errorName: "RunnerError",
    error: "Worker unavailable",
  });
});
