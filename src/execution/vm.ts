import type {
  QuickJSWASMModule,
  QuickJSContext,
  QuickJSRuntime,
} from "quickjs-emscripten-core";
import { guestBootstrap } from "./guest-bootstrap.js";

export interface GuestEvent {
  type: string;
  [key: string]: unknown;
}
export class IsolatedVM {
  private runtime: QuickJSRuntime;
  private context: QuickJSContext;
  private timers = new Map<number, ReturnType<typeof setTimeout>>();
  private deadline = 0;
  private disposed = false;
  private messageCount = 0;
  private messageBytes = 0;
  private pumpTimer: ReturnType<typeof setInterval>;
  constructor(
    module: QuickJSWASMModule,
    private emit: (event: GuestEvent) => void,
  ) {
    this.runtime = module.newRuntime();
    this.runtime.setMemoryLimit(64 * 1024 * 1024);
    this.runtime.setMaxStackSize(512 * 1024);
    this.runtime.setInterruptHandler(
      () => this.disposed || Date.now() > this.deadline,
    );
    this.context = this.runtime.newContext();
    this.install("__sproutSend", (text) => {
      const raw = this.context.getString(text);
      this.messageBytes += raw.length;
      if (
        ++this.messageCount > 1000 ||
        this.messageBytes > 2000000 ||
        raw.length > 500000
      )
        throw new Error("Preview output is too large.");
      this.emit(JSON.parse(raw) as GuestEvent);
    });
    this.install("__sproutSchedule", (idHandle, delayHandle, repeatHandle) => {
      const id = this.context.getNumber(idHandle);
      const delay = this.context.getNumber(delayHandle);
      const repeat = this.context.dump(repeatHandle) === true;
      if (
        !Number.isSafeInteger(id) ||
        id < 1 ||
        !Number.isFinite(delay) ||
        delay < 0 ||
        delay > 120000 ||
        this.timers.size >= 100 ||
        this.timers.has(id)
      )
        throw new Error(
          "Timer limit reached. Clear unused timers and use a smaller delay.",
        );
      const fire = () => {
        if (!repeat) this.timers.delete(id);
        try {
          this.evaluate(`__sproutTick(${id})`);
          this.pump();
        } catch (error) {
          this.fail(error);
        }
      };
      this.timers.set(
        id,
        repeat
          ? setInterval(fire, Math.max(1, delay))
          : setTimeout(fire, delay),
      );
    });
    this.install("__sproutCancel", (idHandle) => {
      const id = this.context.getNumber(idHandle);
      clearTimeout(this.timers.get(id));
      clearInterval(this.timers.get(id));
      this.timers.delete(id);
    });
    this.evaluate(`(${guestBootstrap.toString()})()`);
    this.pumpTimer = setInterval(() => {
      try {
        this.pump();
      } catch (error) {
        this.fail(error);
      }
    }, 5);
  }
  private install(
    name: string,
    implementation: (
      ...args: import("quickjs-emscripten-core").QuickJSHandle[]
    ) => void,
  ) {
    const fn = this.context.newFunction(name, (...args) => {
      implementation(...args);
    });
    this.context.setProp(this.context.global, name, fn);
    fn.dispose();
  }
  evaluate(source: string, budget = 500) {
    this.deadline = Date.now() + budget;
    const result = this.context.evalCode(source, "learner.js");
    if (result.error) {
      const dumped: unknown = this.context.dump(result.error);
      result.error.dispose();
      const record =
        dumped && typeof dumped === "object"
          ? (dumped as Record<string, unknown>)
          : {};
      const message =
        typeof record.message === "string"
          ? record.message
          : typeof dumped === "string"
            ? dumped
            : (JSON.stringify(dumped) ?? String(dumped));
      throw Object.assign(new Error(message), {
        name: typeof record.name === "string" ? record.name : "Error",
      });
    }
    result.value.dispose();
    this.pump();
  }
  private pump() {
    if (this.disposed) return;
    this.deadline = Date.now() + 200;
    const jobs = this.runtime.executePendingJobs(100);
    if (jobs.error) {
      const error = this.context.dump(jobs.error) as { message?: string };
      jobs.error.dispose();
      throw new Error(error.message || "An asynchronous operation failed.");
    }
  }
  private fail(error: unknown) {
    if (this.disposed) return;
    this.emit({
      type: "error",
      error: error instanceof Error ? error.message : "Execution failed",
      errorName: error instanceof Error ? error.name : "Error",
    });
    this.dispose();
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    clearInterval(this.pumpTimer);
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
      clearInterval(timer);
    }
    this.timers.clear();
    this.context.dispose();
    this.runtime.dispose();
  }
}
