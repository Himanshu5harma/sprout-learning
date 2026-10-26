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
import type { z } from "zod";

let vm: IsolatedVM | undefined;
let runId = "";
let starting = false;
let ready = false;
let interactive = false;
type Command = z.infer<typeof commandSchema>;
const pendingCommands: Command[] = [];
const modulePromise = newQuickJSWASMModuleFromVariant(
  newVariant(RELEASE_SYNC, { wasmLocation: wasmURL }),
);
function fail(error: unknown) {
  ready = false;
  pendingCommands.length = 0;
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
function execute(command: Command) {
  if (!vm) return;
  if (command.type === "render") vm.evaluate("__sproutRender()");
  if (command.type === "unmount") vm.evaluate("__sproutUnmount()");
  if (command.type === "event")
    vm.evaluate(`__sproutEvent(${JSON.stringify(command)})`);
}
self.onmessage = async (message: MessageEvent<unknown>) => {
  const start = startSchema.safeParse(message.data);
  try {
    if (start.success && !starting) {
      starting = true;
      runId = start.data.runId;
      interactive = start.data.language === "React";
      const module = await modulePromise;
      vm = new IsolatedVM(module, (event) => {
        const parsed = guestEventSchema.safeParse(event);
        if (!parsed.success)
          throw new Error(
            "The program produced an invalid or oversized preview message.",
          );
        postMessage({ runId, event: parsed.data });
      });
      const instance = vm;
      if (interactive) {
        const [compiled, { default: reactGuest }] = await Promise.all([
          compileReact(start.data.code),
          import("../generated/react-guest.txt?raw"),
        ]);
        if (vm !== instance) return;
        vm.evaluate(reactGuest, 2000);
        // The preview's queued render owns the first mount, including effects.
        vm.evaluate(`__sproutLoad(${JSON.stringify(compiled)});`, 1000);
      } else {
        const body = buildExecutionBody(start.data.code, start.data.checks);
        vm.evaluate(`(new Function(${JSON.stringify(body)}))().then(checks => {
          if (!Array.isArray(checks)) throw new Error('The program returned before its checks. Put return inside your function.');
          __sproutSend(JSON.stringify({type:'result',result:{lines:__sproutLines,checks}}));
        }).catch(error => __sproutSend(JSON.stringify({type:'error', error:String(error?.message ?? error),errorName:String(error?.name || "Error")})));`);
      }
      ready = true;
      for (const command of pendingCommands.splice(0)) execute(command);
      return;
    }
    const command = commandSchema.safeParse(message.data);
    if (!command.success || !starting || !interactive) return;
    if (!ready) {
      if (pendingCommands.length >= 100)
        throw new Error(
          "Too many preview commands arrived while loading. Stop and run again.",
        );
      pendingCommands.push(command.data);
      return;
    }
    execute(command.data);
  } catch (error) {
    fail(error);
  }
};
