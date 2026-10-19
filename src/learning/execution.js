// Behaviour checks share the learner's lexical scope. No source-string checks.
export function buildExecutionBody(code, checks = []) {
  const probes = checks
    .map((check, index) => {
      const expected = JSON.stringify(check.expected) ?? "undefined";
      const expression =
        check.kind === "output" ? "__sproutLines.slice()" : check.expression;
      const actual =
        check.kind === "log-call"
          ? `const __start = __sproutLines.length; await (${expression}); const __actual = __sproutLines.slice(__start);`
          : `const __actual = await (${expression});`;
      return `{
      try {
        ${actual}
        const __expected = ${expected};
        __sproutResults.push({ index: ${index}, label: ${JSON.stringify(check.label)}, passed: __sproutEqual(__actual, __expected), actual: __sproutDisplay(__actual), expected: __sproutDisplay(__expected), help: ${JSON.stringify(check.help || "Compare the input, returned value, and expected result. Change one part, then check again.")} });
      } catch (__error) {
        __sproutResults.push({ index: ${index}, label: ${JSON.stringify(check.label)}, passed: false, actual: __error.name + ': ' + __error.message, expected: __sproutDisplay(${expected}), help: ${JSON.stringify(check.help || "Check that the required function exists and handles this input.")} });
      }
    }`;
    })
    .join("\n");
  return `return (async () => {
    ${code}
    await __sproutIdle();
    const __sproutResults = [];
    ${probes}
    return __sproutResults;
  })();`;
}

export function workerSource() {
  return `
    const nativeTimeout = self.setTimeout.bind(self);
    const nativeClearTimeout = self.clearTimeout.bind(self);
    const nativeInterval = self.setInterval.bind(self);
    const nativeClearInterval = self.clearInterval.bind(self);
    const timeouts = new Set();
    const intervals = new Set();
    const lines = [];
    let asyncError = null;
    const display = value => {
      if (typeof value === 'string') return value;
      try { return JSON.stringify(value, null, 2) ?? String(value); }
      catch { return String(value); }
    };
    const equal = (a, b) => {
      if (Object.is(a, b)) return true;
      if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => equal(v, b[i]));
      if (a && b && typeof a === 'object' && typeof b === 'object') {
        const keys = Object.keys(a);
        return keys.length === Object.keys(b).length && keys.every(key => Object.hasOwn(b, key) && equal(a[key], b[key]));
      }
      return false;
    };
    const log = (...args) => { if (lines.length < 150) lines.push(args.map(display).join(' ').slice(0, 8000)); };
    const console = { log, warn: log, error: log, info: log, clear: () => lines.splice(0) };
    const timeout = (callback, delay = 0, ...args) => {
      const id = nativeTimeout(() => {
        try { callback(...args); } catch (error) { asyncError = error; }
        finally { timeouts.delete(id); }
      }, delay);
      timeouts.add(id); return id;
    };
    const clearTimeout = id => { timeouts.delete(id); nativeClearTimeout(id); };
    const interval = (callback, delay = 0, ...args) => {
      const id = nativeInterval(() => { try { callback(...args); } catch(error) { asyncError = error; } }, delay);
      intervals.add(id); return id;
    };
    const clearInterval = id => { intervals.delete(id); nativeClearInterval(id); };
    const idle = async () => {
      while (timeouts.size || intervals.size) {
        await new Promise(resolve => nativeTimeout(resolve, 5));
        if (asyncError) throw asyncError;
      }
      await Promise.resolve();
      if (asyncError) throw asyncError;
    };
    self.onunhandledrejection = event => { asyncError = event.reason instanceof Error ? event.reason : new Error(String(event.reason)); };
    self.onmessage = async event => {
      try {
        const run = new Function('console', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', '__sproutLines', '__sproutEqual', '__sproutDisplay', '__sproutIdle', event.data.body);
        const checks = await run(console, timeout, clearTimeout, interval, clearInterval, lines, equal, display, idle);
        if (!Array.isArray(checks)) throw new Error('The program returned before the checks could run. Put return inside your function, not at the top level.');
        self.postMessage({ lines, checks });
      } catch (error) { self.postMessage({ lines, checks: [], error: error.message, errorName: error.name }); }
    };
  `;
}
