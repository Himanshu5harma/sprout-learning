// This entire function is serialized and evaluated inside the isolated VM.
export function guestBootstrap() {
  const lines = [];
  const timers = new Map();
  let serial = 0;
  let asyncError = null;
  const display = (value) => {
    if (typeof value === "string") return value;
    try {
      return JSON.stringify(value, null, 2) ?? String(value);
    } catch {
      return String(value);
    }
  };
  const log = (...args) => {
    if (lines.length >= 150) return;
    const line = args.map(display).join(" ").slice(0, 8000);
    lines.push(line);
    __sproutSend(JSON.stringify({ type: "log", line }));
  };
  globalThis.console = {
    log,
    info: log,
    error: log,
    warn: log,
    clear: () => lines.splice(0),
  };
  globalThis.__sproutLines = lines;
  globalThis.__sproutDisplay = display;
  globalThis.__sproutEqual = (a, b) => {
    if (Object.is(a, b)) return true;
    if (Array.isArray(a) || Array.isArray(b)) {
      if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length)
        return false;
      for (let index = 0; index < a.length; index++) {
        if (
          Object.hasOwn(a, index) !== Object.hasOwn(b, index) ||
          !__sproutEqual(a[index], b[index])
        )
          return false;
      }
      return true;
    }
    if (a && b && typeof a === "object" && typeof b === "object") {
      if (
        Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)
      )
        return false;
      const keys = Object.keys(a);
      return (
        keys.length === Object.keys(b).length &&
        keys.every(
          (key) => Object.hasOwn(b, key) && __sproutEqual(a[key], b[key]),
        )
      );
    }
    return false;
  };
  function schedule(callback, delay, args, repeat) {
    if (typeof callback !== "function")
      throw new TypeError(
        "Pass a function to the timer, for example () => console.log('Ready').",
      );
    if (timers.size >= 100)
      throw new Error(
        "Too many pending timers. Clear timers you no longer need.",
      );
    const id = ++serial;
    timers.set(id, { callback, args, repeat });
    __sproutSchedule(
      id,
      Math.min(Math.max(Number(delay) || 0, 0), 120000),
      repeat,
    );
    return id;
  }
  globalThis.setTimeout = (fn, delay = 0, ...args) =>
    schedule(fn, delay, args, false);
  globalThis.setInterval = (fn, delay = 0, ...args) =>
    schedule(fn, delay, args, true);
  globalThis.clearTimeout = globalThis.clearInterval = (id) => {
    timers.delete(id);
    __sproutCancel(Number(id));
  };
  globalThis.__sproutTimerCount = () => timers.size;
  globalThis.__sproutClearTimers = () => {
    for (const id of timers.keys()) __sproutCancel(id);
    timers.clear();
    lines.splice(0);
    asyncError = null;
  };
  globalThis.__sproutTick = (id) => {
    const timer = timers.get(id);
    if (!timer) return;
    if (!timer.repeat) timers.delete(id);
    try {
      timer.callback(...timer.args);
    } catch (error) {
      asyncError = error;
      throw error;
    }
  };
  globalThis.__sproutIdle = async () => {
    while (timers.size) {
      await new Promise((resolve) => setTimeout(resolve, 5));
      if (asyncError) throw asyncError;
    }
    if (asyncError) throw asyncError;
  };
  globalThis.performance = { now: () => Date.now() };
  // Literal JSON data URLs support the authored fetch lesson without network access.
  globalThis.fetch = async (url) => {
    if (typeof url !== "string" || !url.startsWith("data:application/json,"))
      throw new TypeError(
        "Network access is unavailable in this playground. Use a literal data:application/json URL, or run network examples in a local project.",
      );
    const body = decodeURIComponent(url.slice("data:application/json,".length));
    return {
      ok: true,
      status: 200,
      json: async () => JSON.parse(body),
      text: async () => body,
    };
  };
}
