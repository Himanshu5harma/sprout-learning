// Trusted renderer bundled into QuickJS, never executed in the browser realm.
import React from "react";
import Reconciler from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";

let nextId = 0;
const nodes = new Map();
const container = { children: [] };
let root;
let App;
let priority = DefaultEventPriority;
const detach = (parent, child) => {
  const index = parent.children.indexOf(child);
  if (index >= 0) parent.children.splice(index, 1);
};
const append = (parent, child) => {
  detach(parent, child);
  parent.children.push(child);
};
const insert = (parent, child, before) => {
  detach(parent, child);
  parent.children.splice(parent.children.indexOf(before), 0, child);
};
function serialize(node, depth = 0) {
  if (depth > 60) throw new Error("The preview is nested too deeply.");
  if (node.type === "#text")
    return { id: node.id, type: node.type, text: node.text };
  const props = {};
  for (const [key, value] of Object.entries(node.props || {})) {
    if (key === "children" || key === "ref" || key === "key") continue;
    if (key.startsWith("on") && typeof value === "function") props[key] = true;
    else if (
      ["string", "number", "boolean"].includes(typeof value) ||
      value === null
    )
      props[key] = value;
    else if (key === "style" && value && typeof value === "object") {
      props.style = Object.fromEntries(
        Object.entries(value).filter(
          ([, v]) => typeof v === "string" || typeof v === "number",
        ),
      );
    }
  }
  return {
    id: node.id,
    type: node.type,
    props,
    hidden: !!node.hidden,
    children: node.children.map((child) => serialize(child, depth + 1)),
  };
}
function emit() {
  if (nodes.size > 2000)
    throw new Error(
      "The preview has too many elements. Use a smaller example.",
    );
  __sproutSend(
    JSON.stringify({
      type: "tree",
      tree: container.children.map((child) => serialize(child)),
    }),
  );
}
const renderer = Reconciler({
  rendererVersion: React.version,
  rendererPackageName: "sprout-isolated-preview",
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  supportsResources: false,
  supportsSingletons: false,
  isPrimaryRenderer: true,
  supportsMicrotasks: true,
  scheduleMicrotask: (callback) => Promise.resolve().then(callback),
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  getRootHostContext: () => null,
  getChildHostContext: () => null,
  getPublicInstance: (node) => ({
    focus: () => __sproutSend(JSON.stringify({ type: "focus", id: node.id })),
  }),
  prepareForCommit: () => null,
  resetAfterCommit: emit,
  shouldSetTextContent: () => false,
  createInstance(type, props) {
    const node = { id: ++nextId, type, props, children: [] };
    nodes.set(node.id, node);
    return node;
  },
  createTextInstance(text) {
    const node = { id: ++nextId, type: "#text", text };
    nodes.set(node.id, node);
    return node;
  },
  appendInitialChild: append,
  appendChild: append,
  appendChildToContainer: append,
  removeChild: detach,
  removeChildFromContainer: detach,
  insertBefore: insert,
  insertInContainerBefore: insert,
  finalizeInitialChildren: () => false,
  commitMount() {},
  commitUpdate(node, type, oldProps, props) {
    node.props = props;
  },
  commitTextUpdate(node, oldText, text) {
    node.text = text;
  },
  resetTextContent(node) {
    node.children = [];
  },
  clearContainer(node) {
    node.children = [];
  },
  hideInstance(node) {
    node.hidden = true;
  },
  unhideInstance(node) {
    node.hidden = false;
  },
  hideTextInstance(node) {
    node.hidden = true;
  },
  unhideTextInstance(node) {
    node.hidden = false;
  },
  detachDeletedInstance(node) {
    nodes.delete(node.id);
  },
  getCurrentUpdatePriority: () => priority,
  setCurrentUpdatePriority: (value) => {
    priority = value;
  },
  resolveUpdatePriority: () => priority || DefaultEventPriority,
  maySuspendCommit: () => false,
  maySuspendCommitOnUpdate: () => false,
  maySuspendCommitInSyncRender: () => false,
  preloadInstance: () => true,
  startSuspendingCommit() {},
  suspendInstance() {},
  suspendOnActiveViewTransition() {},
  waitForCommitToBeReady: () => null,
  NotPendingTransition: null,
  HostTransitionContext: React.createContext(null),
  resetFormInstance() {},
  requestPostPaintCallback: (callback) => setTimeout(callback, 0),
  shouldAttemptEagerTransition: () => false,
  trackSchedulerEvent() {},
  resolveEventType: () => null,
  resolveEventTimeStamp: () => -1,
});
function fail(error) {
  __sproutSend(
    JSON.stringify({
      type: "error",
      error: String(error?.message ?? error),
      errorName: String(error?.name || "Error"),
    }),
  );
}
globalThis.React = React;
globalThis.require = (name) => {
  if (name === "react") return React;
  throw new Error(
    "This playground supports imports from react only. Use a local project for other packages.",
  );
};
globalThis.__sproutLoad = (code) => {
  App = new Function(
    "React",
    "require",
    "exports",
    code + "\nreturn typeof App !== 'undefined' ? App : exports.default;",
  )(React, require, {});
  if (typeof App !== "function" && typeof App !== "object")
    throw new Error(
      "Name your component App, or export a component as default.",
    );
};
globalThis.__sproutRender = () => {
  if (root) {
    renderer.updateContainerSync(null, root, null, null);
    renderer.flushSyncWork();
    renderer.flushPassiveEffects();
  }
  __sproutClearTimers();
  nodes.clear();
  container.children = [];
  nextId = 0;
  root = renderer.createContainer(
    container,
    1,
    null,
    false,
    null,
    "",
    fail,
    () => {},
    fail,
    null,
  );
  renderer.updateContainerSync(React.createElement(App), root, null, null);
  renderer.flushSyncWork();
  renderer.flushPassiveEffects();
};
globalThis.__sproutUnmount = () => {
  if (root) {
    renderer.updateContainerSync(null, root, null, null);
    renderer.flushSyncWork();
    renderer.flushPassiveEffects();
    root = null;
  }
  __sproutSend(JSON.stringify({ type: "timers", count: __sproutTimerCount() }));
};
globalThis.__sproutEvent = ({ id, event, value, checked, key }) => {
  const node = nodes.get(id);
  if (!node) return;
  let prevented = false;
  const target = { value, checked };
  const payload = {
    target,
    currentTarget: target,
    key,
    preventDefault() {
      prevented = true;
    },
    stopPropagation() {},
  };
  renderer.flushSyncFromReconciler(() => node.props[event]?.(payload));
  renderer.flushPassiveEffects();
  if (event === "onSubmit" && !prevented) {
    const error = new Error(
      "The form tried to navigate away. Call event.preventDefault() in onSubmit before updating state. The preview kept your work on screen.",
    );
    error.name = "FormNavigation";
    throw error;
  }
};
