import React from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("app");
const nativeTimeout = window.setTimeout.bind(window);
const nativeClearTimeout = window.clearTimeout.bind(window);
const nativeInterval = window.setInterval.bind(window);
const nativeClearInterval = window.clearInterval.bind(window);
const timers = new Map();
const logs = [];
let root = null;
let currentRun = null;
let fatal = null;

function send(type, data = {}) {
  window.parent.postMessage({ type, runId: currentRun, ...data }, "*");
}
function format(value) {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2) ?? String(value);
  } catch {
    return String(value);
  }
}
for (const method of ["log", "info", "warn", "error"]) {
  console[method] = (...args) => {
    if (logs.length >= 150) return;
    const line = args.map(format).join(" ").slice(0, 8000);
    logs.push(line);
    send("sprout-preview-log", { line });
  };
}
window.setTimeout = (callback, delay = 0, ...args) => {
  const id = nativeTimeout(() => {
    timers.delete(id);
    callback(...args);
  }, delay);
  timers.set(id, "timeout");
  return id;
};
window.clearTimeout = (id) => {
  timers.delete(id);
  nativeClearTimeout(id);
};
window.setInterval = (callback, delay = 0, ...args) => {
  const id = nativeInterval(callback, delay, ...args);
  timers.set(id, "interval");
  return id;
};
window.clearInterval = (id) => {
  timers.delete(id);
  nativeClearInterval(id);
};
const delay = (ms) => new Promise((resolve) => nativeTimeout(resolve, ms));
// Permit form events inside the opaque sandbox, but keep accidental default
// submission from navigating the practice frame away from the learner's work.
document.addEventListener("submit", (event) => {
  if (!event.defaultPrevented) {
    event.preventDefault();
    fatal = new Error(
      "The form tried to navigate away. In its onSubmit handler, call event.preventDefault() before updating state. The preview kept your work on screen.",
    );
    fatal.name = "FormNavigation";
    send("sprout-preview-error", {
      message: fatal.message,
      name: "FormNavigation",
    });
  }
});
const normalize = (value) => String(value).replace(/\s+/g, " ").trim();
function labelFor(element) {
  const labelled = element.getAttribute("aria-labelledby");
  if (labelled)
    return normalize(
      labelled
        .split(/\s+/)
        .map((id) => document.getElementById(id)?.textContent || "")
        .join(" "),
    );
  if (element.hasAttribute("aria-label"))
    return normalize(element.getAttribute("aria-label"));
  if (element.labels?.length)
    return normalize(
      [...element.labels].map((label) => label.textContent).join(" "),
    );
  return normalize(element.textContent || element.value || "");
}
function visible(element) {
  return (
    !!element &&
    !element.hidden &&
    getComputedStyle(element).visibility !== "hidden" &&
    !!element.getClientRects().length
  );
}
function find(role, name) {
  const selectors = {
    button: 'button, input[type="submit"], [role="button"]',
    textbox:
      'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), textarea, [role="textbox"]',
    heading: 'h1,h2,h3,h4,h5,h6,[role="heading"]',
    status: '[role="status"]',
    alert: '[role="alert"]',
    checkbox: 'input[type="checkbox"],[role="checkbox"]',
  };
  return [
    ...container.querySelectorAll(selectors[role] || `[role="${role}"]`),
  ].find(
    (element) => visible(element) && labelFor(element) === normalize(name),
  );
}
function field(label) {
  return find("textbox", label);
}
async function waitFor(test, description) {
  const deadline = Date.now() + 1600;
  do {
    if (fatal) throw fatal;
    if (test()) return;
    await delay(20);
  } while (Date.now() < deadline);
  throw new Error(description);
}
function screenText() {
  return normalize(container.innerText);
}
async function step(action) {
  window.__sproutSteps = 0;
  const value = normalize(action.value ?? "");
  if (action.action === "text")
    return waitFor(
      () => screenText().includes(value),
      `Expected visible text “${action.value}”; the preview currently says “${screenText()}”.`,
    );
  if (action.action === "noText")
    return waitFor(
      () => !screenText().includes(value),
      `The old text “${action.value}” is still visible. Remove the stale branch or update its state.`,
    );
  if (action.action === "element")
    return waitFor(
      () => find(action.role, action.name),
      `Expected a ${action.role} named “${action.name}”. Use a semantic element and an accessible name.`,
    );
  if (action.action === "click") {
    const button = find("button", action.name);
    if (!button)
      throw new Error(
        `Could not find a button named “${action.name}”. Check its visible label and use a real button.`,
      );
    if (button.disabled)
      throw new Error(
        `“${action.name}” is disabled when this action needs to be available.`,
      );
    button.click();
    await delay(35);
    return;
  }
  if (action.action === "fill") {
    const input = field(action.label);
    if (!input)
      throw new Error(
        `Could not find an input labeled “${action.label}”. Connect a visible label with htmlFor and id.`,
      );
    const prototype =
      input instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, "value").set.call(
      input,
      action.value,
    );
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await delay(35);
    if (input.value !== String(action.value))
      throw new Error(
        `The input still contains “${input.value}” after typing “${action.value}”. Connect value and onChange to the same state.`,
      );
    return;
  }
  if (action.action === "focused")
    return waitFor(
      () => document.activeElement === field(action.label),
      `The field “${action.label}” did not receive keyboard focus. Read the node from ref.current and call focus().`,
    );
  if (action.action === "count")
    return waitFor(
      () =>
        [...container.querySelectorAll(action.selector)].filter(visible)
          .length === action.value,
      `Expected ${action.value} visible ${action.selector} elements; found ${[...container.querySelectorAll(action.selector)].filter(visible).length}. Check the rendered collection and empty state.`,
    );
  if (action.action === "texts")
    return waitFor(
      () =>
        JSON.stringify(
          [...container.querySelectorAll(action.selector)]
            .filter(visible)
            .map((el) => normalize(el.innerText)),
        ) === JSON.stringify(action.value.map(normalize)),
      `Expected items ${JSON.stringify(action.value)} in order. Read the current map callback item, not one fixed array position.`,
    );
  if (action.action === "log")
    return waitFor(
      () => logs.includes(action.value),
      `Expected a Preview console message “${action.value}” after the interaction. Keep the log in the handler.`,
    );
  if (action.action === "noLog") {
    if (logs.includes(action.value))
      throw new Error(
        `“${action.value}” was printed before the action. Pass the handler rather than calling it while rendering.`,
      );
    return;
  }
  if (action.action === "logCount") {
    if (logs.filter((line) => line === action.value).length !== action.count)
      throw new Error(
        `Expected ${action.count} messages “${action.value}”, but found ${logs.filter((line) => line === action.value).length}. Check when the handler is called.`,
      );
    return;
  }
  if (action.action === "unmount") {
    root?.unmount();
    root = null;
    await delay(35);
    return;
  }
  if (action.action === "noTimers") {
    if (timers.size)
      throw new Error(
        `${timers.size} timer(s) still run after removal. Return cleanup from the effect and clear each timer ID.`,
      );
    return;
  }
  if (action.action === "wait") {
    await delay(Math.min(action.ms, 1000));
    return;
  }
  if (action.action === "attribute") {
    const element = find(action.role, action.name);
    if (!element || element.getAttribute(action.attribute) !== action.value)
      throw new Error(
        `Expected ${action.attribute}=${action.value} on ${action.name}.`,
      );
    return;
  }
  throw new Error(`Unknown curriculum check action: ${action.action}`);
}
function clearTrackedTimers() {
  for (const [id, kind] of timers)
    (kind === "interval" ? nativeClearInterval : nativeClearTimeout)(id);
  timers.clear();
}
async function render(App) {
  root?.unmount();
  root = null;
  clearTrackedTimers();
  logs.splice(0);
  fatal = null;
  window.__sproutSteps = 0;
  root = createRoot(container, {
    onUncaughtError(error) {
      fatal = error;
      send("sprout-preview-error", {
        message: error.message,
        name: error.name,
      });
    },
    onCaughtError(error) {
      send("sprout-preview-diagnostic", { message: error.message });
    },
  });
  root.render(React.createElement(App));
  await delay(40);
  if (fatal) throw fatal;
}
window.addEventListener("error", (event) => {
  fatal = event.error || new Error(event.message);
  send("sprout-preview-error", { message: fatal.message, name: fatal.name });
});
window.addEventListener("unhandledrejection", (event) => {
  fatal =
    event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason));
  send("sprout-preview-error", { message: fatal.message, name: fatal.name });
});
window.addEventListener("message", async (event) => {
  if (event.source !== window.parent || event.data?.type !== "sprout-render")
    return;
  currentRun = event.data.runId;
  try {
    const exports = {};
    const require = (name) => {
      if (name === "react") return React;
      throw new Error(
        "Unsupported import: " +
          name +
          ". This playground supports imports from react only.",
      );
    };
    window.__sproutSteps = 0;
    const App = new Function(
      "React",
      "require",
      "exports",
      `${event.data.code}\nreturn typeof App !== 'undefined' ? App : exports.default;`,
    )(React, require, exports);
    if (typeof App !== "function")
      throw new Error(
        "Name your component App, or export a component as default.",
      );
    const results = [];
    for (const check of event.data.checks || []) {
      try {
        await render(App);
        for (const action of check.steps) await step(action);
        results.push({
          label: check.label,
          passed: true,
          actual: "Observed expected behaviour",
          expected: "All listed interactions succeed",
        });
      } catch (error) {
        results.push({
          label: check.label,
          passed: false,
          actual: error.message,
          expected: "The behaviour described in the task",
          help: "Compare the visible state with the task. Change one handler, input, or state update, then check again.",
        });
      }
    }
    await render(App);
    send("sprout-preview-complete", { checks: results });
  } catch (error) {
    send("sprout-preview-error", { message: error.message, name: error.name });
  }
});
send("sprout-preview-ready");
