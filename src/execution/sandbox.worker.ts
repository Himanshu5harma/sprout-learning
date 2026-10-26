import RELEASE_SYNC from "@jitl/quickjs-wasmfile-release-sync";
import wasmURL from "@jitl/quickjs-wasmfile-release-sync/wasm?url";
import {
  newQuickJSWASMModuleFromVariant,
  newVariant,
} from "quickjs-emscripten-core";
import { compileReact } from "../learning/compile-react.js";
import { buildExecutionBody } from "../learning/execution.js";
import { IsolatedVM } from "./vm";
import { startSchema, commandSchema, guestEventSchema } from "./protocol";

let vm: IsolatedVM | undefined;
let runId = "";
let starting = false;
const modulePromise = newQuickJSWASMModuleFromVariant(
  newVariant(RELEASE_SYNC, { wasmLocation: wasmURL }),
);
function fail(error: unknown) {
  postMessage({
    runId,
    event: {
      type: "error",
      error:
        error instanceof Error
          ? error.message.slice(0, 8000)
          : "Execution failed",
      errorName: error instanceof Error ? error.name : "Error",
    },
  });
  vm?.dispose();
  vm = undefined;
}
self.onmessage = async (message: MessageEvent<unknown>) => {
  const start = startSchema.safeParse(message.data);
  try {
    if (start.success && !starting) {
      starting = true;
      runId = start.data.runId;
      const module = await modulePromise;
      vm = new IsolatedVM(module, (event) => {
        const parsed = guestEventSchema.safeParse(event);
        if (!parsed.success)
          throw new Error(
            "The program produced an invalid or oversized preview message.",
          );
        postMessage({ runId, event: parsed.data });
      });
      if (start.data.language === "React") {
        const [compiled, { default: reactGuest }] = await Promise.all([
          compileReact(start.data.code),
          import("../generated/react-guest.txt?raw"),
        ]);
        vm.evaluate(reactGuest, 2000);
        vm.evaluate(
          `__sproutLoad(${JSON.stringify(compiled)}); __sproutRender();`,
          1000,
        );
      } else {
        const body = buildExecutionBody(start.data.code, start.data.checks);
        vm.evaluate(`(new Function(${JSON.stringify(body)}))().then(checks => {
          if (!Array.isArray(checks)) throw new Error('The program returned before its checks. Put return inside your function.');
          __sproutSend(JSON.stringify({type:'result',result:{lines:__sproutLines,checks}}));
        }).catch(error => __sproutSend(JSON.stringify({type:'error', error:String(error?.message ?? error),errorName:String(error?.name || "Error")})));`);
      }
      return;
    }
    const command = commandSchema.safeParse(message.data);
    if (!command.success || !vm) return;
    if (command.data.type === "render") vm.evaluate("__sproutRender()");
    if (command.data.type === "unmount") vm.evaluate("__sproutUnmount()");
    if (command.data.type === "event")
      vm.evaluate(`__sproutEvent(${JSON.stringify(command.data)})`);
  } catch (error) {
    fail(error);
  }
};
