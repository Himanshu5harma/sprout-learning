import { test, expect } from "@playwright/test";
interface PerfEvidence {
  lcp: number;
  longTasks: number[];
  events: number[];
}
declare global {
  interface Window {
    sproutPerf: PerfEvidence;
  }
}
test("records local loading and typing performance without loading the editor on the overview", async ({
  page,
}, info) => {
  await page.addInitScript(() => {
    window.sproutPerf = { lcp: 0, longTasks: [], events: [] };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        window.sproutPerf.lcp = entry.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        window.sproutPerf.longTasks.push(entry.duration);
    }).observe({ type: "longtask", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        window.sproutPerf.events.push(entry.duration);
    }).observe({
      type: "event",
      buffered: true,
      durationThreshold: 16,
    } as PerformanceObserverInit);
  });
  const loaded: string[] = [];
  page.on("request", (request) => loaded.push(request.url()));
  await page.goto("/#overview");
  await expect(page.locator("main h1")).toBeVisible();
  expect(
    loaded.some((url) => /CodeLab-|babel-|sandbox.worker|emscripten/.test(url)),
  ).toBe(false);
  const loading = await page.evaluate(() => ({ ...window.sproutPerf }));
  await page.getByRole("button", { name: /^Practice lab/ }).click();
  const editor = page.getByRole("textbox", {
    name: "JavaScript code editor",
    exact: true,
  });
  await expect(editor).toBeVisible();
  await editor.fill("");
  await page.evaluate(() => {
    window.sproutPerf.longTasks = [];
    window.sproutPerf.events = [];
  });
  const started = Date.now();
  await editor.pressSequentially(
    "const product = 'Tea';\nconsole.log(product);",
    { delay: 8 },
  );
  const evidence = await page.evaluate(() => ({ ...window.sproutPerf }));
  const report = {
    loading,
    typing: { ...evidence, automationWallMs: Date.now() - started },
    notes:
      "Local Chromium, unthrottled. Event durations are quantized by the browser. Wall time includes automation and the chosen 8 ms delay; this is not a field INP measurement.",
  };
  await info.attach("performance-evidence", {
    body: JSON.stringify(report, null, 2),
    contentType: "application/json",
  });
  console.log(JSON.stringify(report));
  expect(evidence.longTasks.filter((duration) => duration > 200)).toEqual([]);
});
