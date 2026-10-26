import test from "node:test";
import assert from "node:assert/strict";
import { execute } from "./execution-helper.mjs";
test("guest has no host network, storage, messaging, worker, or DOM privileges", async () => {
  const result = await execute(
    'console.log([typeof self,typeof window,typeof document,typeof indexedDB,typeof localStorage,typeof XMLHttpRequest,typeof WebSocket,typeof importScripts,typeof Worker,typeof postMessage,typeof process].join(","));',
  );
  assert.equal(result.error, undefined);
  assert.equal(result.lines[0], Array(11).fill("undefined").join(","));
  const denied = await execute('await fetch("https://example.com/private");');
  assert.match(denied.error, /Network access is unavailable/);
});
for (const [label, code] of [
  ["loop", "while(true){}"],
  [
    "counter bypass",
    "globalThis.__sproutSteps=0;while(true){globalThis.__sproutSteps=0;}",
  ],
  ["dynamic loop", 'eval("while(true){}");'],
  ["Function loop", 'Function("while(true){}")();'],
  ["recursion", "function again(){again()} again();"],
])
  test(`interrupts ${label} independently of source guards`, async () => {
    const start = Date.now();
    const result = await execute(code);
    assert.ok(result.error);
    assert.ok(Date.now() - start < 2500);
  });
test("constructor escapes stay inside the guest realm", async () => {
  const result = await execute(
    "console.log((()=>{}).constructor(\"return typeof process + '/' + typeof self\")());",
  );
  assert.deepEqual(result.lines, ["undefined/undefined"]);
});
test("bounds guest memory, host timers, and output independently of guest wrappers", async () => {
  const memory = await execute(
    'const values=[];while(true){values.push(new Array(10000).fill("large"))}',
  );
  assert.ok(memory.error);
  const timers = await execute(
    "for(let id=1;id<1000;id++)__sproutSchedule(id,1000,true);",
  );
  assert.match(timers.error, /Timer limit/);
  const logs = await execute("for(let i=0;i<10000;i++)console.log(i);");
  assert.equal(logs.lines.length, 150);
  assert.equal(logs.lines.at(-1), "149");
});
test("thrown primitive values are reported without becoming a timeout", async () => {
  for (const [source, expected] of [
    ["throw null;", "null"],
    ["throw 42;", "42"],
    ['throw "No stock";', "No stock"],
  ]) {
    const result = await execute(source);
    assert.equal(result.error, expected);
  }
});
test("practical checks distinguish arrays from numeric-key objects", async () => {
  const checks = [
    { label: "Returned array", expression: "items", expected: ["Tea"] },
  ];
  const bad = await execute('const items={0:"Tea"};', checks);
  assert.equal(bad.checks[0].passed, false);
  const sparse = await execute("const items = new Array(1);", checks);
  assert.equal(sparse.checks[0].passed, false);
  const good = await execute('const items=Object.values({0:"Tea"});', checks);
  assert.equal(good.checks[0].passed, true);
});
