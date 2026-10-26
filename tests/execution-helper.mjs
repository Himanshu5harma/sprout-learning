import { Worker } from "node:worker_threads";
import { buildExecutionBody } from "../src/learning/execution.js";

export function execute(code, checks = [], limit = 3200) {
  return new Promise((resolve) => {
    const worker = new Worker(new URL("./vm-worker.mjs", import.meta.url));
    let settled = false;
    function finish(result) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      resolve(result);
    }
    const timer = setTimeout(
      () => finish({ lines: [], checks: [], error: "Execution limit" }),
      limit,
    );
    worker.on("message", finish);
    worker.on("error", (error) =>
      finish({ lines: [], checks: [], error: error.message }),
    );
    worker.postMessage({ body: buildExecutionBody(code, checks) });
  });
}
