import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("expanding preserves the editor, undo history, live React state, and saved draft", async ({
  page,
}) => {
  await page.goto("/#practice");
  await page.getByRole("button", { name: "React", exact: true }).click();
  const editor = page.getByRole("textbox", {
    name: "React code editor",
    exact: true,
  });
  const code =
    "function App(){const [n,setN]=React.useState(0);return <button onClick={()=>setN(n+1)}>Count {n}</button>}";
  await editor.fill(code);
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  const counter = page
    .frameLocator("iframe")
    .getByRole("button", { name: "Count 0", exact: true });
  await counter.click();
  await page.getByRole("button", { name: "Expand", exact: true }).click();
  const workspace = page.getByRole("dialog", {
    name: "React practice workspace",
    exact: true,
  });
  await expect(workspace).toBeVisible();
  await expect(
    page.frameLocator("iframe").getByRole("button", { name: "Count 1" }),
  ).toBeVisible();
  await editor.focus();
  await page.keyboard.press("ControlOrMeta+End");
  await page.keyboard.insertText("\n// expanded draft");
  await page.keyboard.press("Escape");
  await expect(workspace).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Expand", exact: true }),
  ).toBeFocused();
  await expect(editor).toContainText("expanded draft");
  await editor.focus();
  await page.keyboard.press("ControlOrMeta+z");
  await expect(editor).toHaveText(code);
  await expect(
    page.frameLocator("iframe").getByRole("button", { name: "Count 1" }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "React", exact: true }).click();
  await expect(editor).toHaveText(code);
});

test("Escape collapses a workspace inside a lesson before closing the lesson", async ({
  page,
}) => {
  await page.goto("/#overview");
  const opener = page.getByRole("button", {
    name: "Let’s start learning",
    exact: true,
  });
  await opener.click();
  const lesson = page.getByRole("dialog");
  await lesson.getByRole("tab", { name: "2 Practice", exact: true }).click();
  await lesson.getByRole("button", { name: "Expand", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "JavaScript practice workspace" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await expect(
    lesson.getByRole("button", { name: "Expand", exact: true }),
  ).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(opener).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
});

for (const viewport of [
  { width: 320, height: 640 },
  { width: 768, height: 1024 },
  { width: 1440, height: 800 },
  { width: 2560, height: 1440 },
]) {
  test(`expanded workspace fits ${viewport.width}px, runs code, and contains keyboard focus`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/#practice");
    await page.getByRole("button", { name: "Expand", exact: true }).click();
    const dialog = page.getByRole("dialog");
    const bounds = await dialog.boundingBox();
    expect(bounds).toEqual({ x: 0, y: 0, ...viewport });
    expect(
      await dialog.evaluate(
        (element) => element.scrollWidth <= element.clientWidth + 1,
      ),
    ).toBe(true);
    const editor = dialog.getByRole("textbox", {
      name: "JavaScript code editor",
      exact: true,
    });
    await editor.fill("console.log('More room to practise');");
    await editor.press("ControlOrMeta+Enter");
    await expect(dialog.locator(".console-output")).toContainText(
      "More room to practise",
    );
    const exit = dialog.getByRole("button", {
      name: "Exit full screen",
      exact: true,
    });
    await exit.focus();
    await page.keyboard.press("Shift+Tab");
    expect(
      await page.evaluate(
        () =>
          document.activeElement?.closest('dialog[aria-modal="true"]') !== null,
      ),
    ).toBe(true);
    if (viewport.width === 1440) {
      await editor.fill("// Keep the toolbar reachable\n".repeat(100));
      await editor.press("ControlOrMeta+End");
      await expect(exit).toBeInViewport();
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    }
    await exit.click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Expand", exact: true }),
    ).toBeFocused();
  });
}

test("progress uses the same readable text scale from phone to wide desktop", async ({
  page,
}) => {
  const samples = [];
  for (const width of [390, 1440, 2560]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#progress");
    await expect(page.locator(".skill-grid h2").first()).toBeVisible();
    samples.push(
      await page
        .locator(".skill-grid .ui-card")
        .first()
        .evaluate((card) => ({
          heading: parseFloat(
            getComputedStyle(card.querySelector("h2")!).fontSize,
          ),
          body: parseFloat(getComputedStyle(card.querySelector("p")!).fontSize),
          button: parseFloat(
            getComputedStyle(card.querySelector("button")!).fontSize,
          ),
        })),
    );
  }
  for (const sample of samples) {
    expect(sample).toEqual(samples[0]);
    expect(sample.heading).toBeGreaterThan(sample.body);
    expect(sample.heading).toBeLessThanOrEqual(20);
    expect(sample.body).toBeGreaterThanOrEqual(14);
    expect(sample.button).toBe(sample.body);
  }
});
