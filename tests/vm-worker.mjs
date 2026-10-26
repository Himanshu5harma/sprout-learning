import { parentPort } from "node:worker_threads";
import { newQuickJSWASMModuleFromVariant } from "quickjs-emscripten-core";
import RELEASE_SYNC from "@jitl/quickjs-wasmfile-release-sync";
import { IsolatedVM } from "../output/test-vm.mjs";
const module = await newQuickJSWASMModuleFromVariant(RELEASE_SYNC);
parentPort.on("message", ({ body }) => {
  const lines = [];
  const vm = new IsolatedVM(module, (event) => {
    if (event.type === "log") lines.push(event.line);
    if (event.type === "result") parentPort.postMessage(event.result);
    if (event.type === "error")
      parentPort.postMessage({
        lines,
        checks: [],
        error: event.error,
        errorName: event.errorName,
      });
  });
  try {
    vm.evaluate(
      `(new Function(${JSON.stringify(body)}))().then(checks=>__sproutSend(JSON.stringify({type:'result',result:{lines:__sproutLines,checks}}))).catch(error=>__sproutSend(JSON.stringify({type:'error',error:String(error?.message ?? error),errorName:String(error?.name || "Error")})));`,
    );
  } catch (error) {
    parentPort.postMessage({
      lines,
      checks: [],
      error: error.message,
      errorName: error.name,
    });
  }
});
