// Trusted DOM adapter. Learner code runs only inside QuickJS in a worker.
import { treeSchema } from "./execution/protocol";
import { z } from "zod";
const container = document.getElementById("app");
const logs = [];
let currentRun = null;
let fatal = null;
let timerCount = 0;
let revision = 0;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function send(type, data = {}) {
  parent.postMessage({ type, runId: currentRun, ...data }, "*");
}
const allowedTags = new Set(
  "div span p h1 h2 h3 h4 h5 h6 button input textarea select option form label ul ol li strong em b i small section article header footer main nav aside output fieldset legend br hr code pre table thead tbody tr th td dl dt dd details summary a".split(
    " ",
  ),
);
const allowedProps = new Set(
  "id className title role htmlFor type name value defaultValue checked defaultChecked disabled placeholder required min max step maxLength rows cols multiple tabIndex autoComplete aria-label aria-labelledby aria-describedby aria-live aria-atomic aria-expanded aria-pressed aria-checked aria-hidden data-testid".split(
    " ",
  ),
);
const styleProps = new Set(
  "color backgroundColor padding margin fontSize fontWeight display gap border borderRadius textAlign width maxWidth minHeight opacity textDecoration flexDirection alignItems justifyContent gridTemplateColumns".split(
    " ",
  ),
);
const domNodes = new Map();
function applyTree(tree) {
  const used = new Set();
  function patch(spec) {
    if (!allowedTags.has(spec.type) && spec.type !== "#text")
      throw new Error(
        "Unsupported preview element: " +
          spec.type +
          ". Use a local project for browser resources or embedded content.",
      );
    used.add(spec.id);
    let node = domNodes.get(spec.id);
    if (
      !node ||
      (spec.type === "#text"
        ? node.nodeType !== 3
        : node.localName !== spec.type)
    ) {
      node =
        spec.type === "#text"
          ? document.createTextNode("")
          : document.createElement(spec.type);
      domNodes.set(spec.id, node);
    }
    if (spec.type === "#text") {
      node.textContent = spec.hidden ? "" : spec.text || "";
      return node;
    }
    node.dataset.sproutId = String(spec.id);
    for (const attribute of [...node.attributes])
      if (attribute.name !== "data-sprout-id")
        node.removeAttribute(attribute.name);
    const props = spec.props || {};
    for (const [key, value] of Object.entries(props)) {
      if (allowedProps.has(key) && value !== null && value !== false) {
        const attr =
          key === "className" ? "class" : key === "htmlFor" ? "for" : key;
        node.setAttribute(attr, value === true ? "" : String(value));
      }
    }
    if ("disabled" in node) node.disabled = !!props.disabled;
    if ("checked" in props) node.checked = !!props.checked;
    if (
      "value" in props &&
      "value" in node &&
      node.value !== String(props.value ?? "")
    )
      node.value = String(props.value ?? "");
    if (props.style && typeof props.style === "object")
      for (const [key, value] of Object.entries(props.style)) {
        if (
          styleProps.has(key) &&
          !/url\s*\(|expression|@import/i.test(String(value))
        )
          node.style[key] =
            typeof value === "number" &&
            !["opacity", "fontWeight"].includes(key)
              ? value + "px"
              : String(value);
      }
    node.hidden = !!spec.hidden;
    const children = (spec.children || []).map(patch);
    children.forEach((child, i) => {
      if (node.childNodes[i] !== child)
        node.insertBefore(child, node.childNodes[i] || null);
    });
    while (node.childNodes.length > children.length) node.lastChild.remove();
    node.__sproutEvents = props;
    return node;
  }
  const children = tree.map(patch);
  children.forEach((child, i) => {
    if (container.childNodes[i] !== child)
      container.insertBefore(child, container.childNodes[i] || null);
  });
  while (container.childNodes.length > children.length)
    container.lastChild.remove();
  for (const id of domNodes.keys()) if (!used.has(id)) domNodes.delete(id);
  revision++;
}
for (const [native, eventName] of [
  ["click", "onClick"],
  ["input", "onChange"],
  ["submit", "onSubmit"],
  ["keydown", "onKeyDown"],
]) {
  container.addEventListener(native, (event) => {
    if (native === "submit" || event.target.closest("a"))
      event.preventDefault();
    let node = event.target;
    while (node && node !== container) {
      if (node.__sproutEvents?.[eventName]) {
        send("sprout-preview-command", {
          command: {
            type: "event",
            id: Number(node.dataset.sproutId),
            event: eventName,
            value: String(event.target.value || ""),
            checked: !!event.target.checked,
            key: event.key,
          },
        });
      }
      node = node.parentElement;
    }
  });
}
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
  const deadline = Date.now() + (revision ? 1600 : 12000);
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
    send("sprout-preview-command", { command: { type: "unmount" } });
    await delay(35);
    return;
  }
  if (action.action === "noTimers") {
    if (timerCount)
      throw new Error(
        `${timerCount} timer(s) still run after removal. Return cleanup from the effect and clear each timer ID.`,
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
async function render() {
  logs.splice(0);
  fatal = null;
  timerCount = 0;
  const previous = revision;
  send("sprout-preview-command", { command: { type: "render" } });
  await waitFor(
    () => revision > previous,
    "The component did not render. Stop and run it again.",
  );
  await delay(40);
  if (fatal) throw fatal;
}
window.addEventListener("message", async (event) => {
  if (event.source !== parent) return;
  const data = event.data;
  if (data?.type === "sprout-runtime-event" && data.runId === currentRun) {
    const value = data.event;
    try {
      if (value.type === "tree")
        applyTree(z.array(treeSchema).max(2000).parse(value.tree));
      if (value.type === "focus") domNodes.get(value.id)?.focus();
      if (value.type === "timers") timerCount = value.count;
      if (value.type === "log") {
        if (logs.length < 150) logs.push(String(value.line).slice(0, 8000));
        send("sprout-preview-log", { line: value.line });
      }
      if (value.type === "error")
        throw Object.assign(new Error(value.error), { name: value.errorName });
    } catch (error) {
      fatal = error;
      send("sprout-preview-error", {
        message: error.message,
        name: error.name,
      });
    }
    return;
  }
  if (
    data?.type !== "sprout-render" ||
    typeof data.runId !== "string" ||
    currentRun
  )
    return;
  currentRun = data.runId;
  try {
    const results = [];
    for (const check of data.checks || []) {
      try {
        await render();
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
    await render();
    if (!fatal) send("sprout-preview-complete", { checks: results });
  } catch (error) {
    send("sprout-preview-error", { message: error.message, name: error.name });
  }
});
send("sprout-preview-ready");
