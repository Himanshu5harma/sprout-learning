import { test, expect } from "@playwright/test";
test("JavaScript executes and React renders interactive state", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") console.log("browser error:", m.text());
  });
  await page.goto("/#practice");
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await expect(page.locator(".console-output")).toContainText("Tea");
  await page.getByRole("button", { name: "React", exact: true }).click();
  const code =
    "function App(){const [n,setN]=React.useState(0);return <div><p>Count {n}</p><button onClick={()=>setN(n+1)}>Add</button></div>}";
  await page
    .getByRole("textbox", { name: "React code editor", exact: true })
    .fill(code);
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  const frame = page.frameLocator("iframe");
  await expect(frame.getByText("Count 0", { exact: true })).toBeVisible();
  await frame.getByRole("button", { name: "Add", exact: true }).click();
  await expect(frame.getByText("Count 1", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test("React startup queues commands while the renderer is loading", async ({
  page,
  context,
}) => {
  let requested = false;
  let release!: () => void;
  const loading = new Promise<void>((resolve) => {
    release = resolve;
  });
  await context.route("**/react-guest-*.js", async (route) => {
    requested = true;
    await loading;
    await route.continue();
  });
  try {
    await page.goto("/#practice");
    await page.getByRole("button", { name: "React", exact: true }).click();
    const started = page.waitForEvent("worker");
    await page.getByRole("button", { name: "Run code", exact: true }).click();
    const worker = await started;
    await expect.poll(() => requested).toBe(true);
    // The real preview can request another render while its compiler/renderer
    // chunk is still loading. Hold that chunk to reproduce the CI race.
    await worker.evaluate(() =>
      self.dispatchEvent(
        new MessageEvent("message", {
          data: { type: "render" },
        }),
      ),
    );
    release();
    await expect(
      page.frameLocator("iframe").getByRole("heading", {
        name: "Your first shop",
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator(".learning-error")).toHaveCount(0);
  } finally {
    release();
  }
});
