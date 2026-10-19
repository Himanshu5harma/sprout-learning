import { Worker } from "node:worker_threads";
import { buildExecutionBody, workerSource } from "../src/learning/execution.js";

export function execute(code, checks = [], limit = 3200) {
  return new Promise((resolve) => {
    const bridge = `const {parentPort}=require('node:worker_threads'); global.self=globalThis; self.postMessage=data=>parentPort.postMessage(data); parentPort.on('message',data=>self.onmessage({data}));`;
    const worker = new Worker(bridge + workerSource(), { eval: true });
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
