import { test, expect } from "@playwright/test";
for (const width of [320, 768, 1440, 1920])
  test(`all routes reflow at ${width} CSS pixels`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 700 : 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of [
      "overview",
      "paths",
      "practice",
      "projects",
      "bookmarks",
      "progress",
      "resources",
    ]) {
      await page.goto("/#" + route);
      await expect(page.locator("main h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        route,
      ).toBe(true);
      const control = page.locator("main button:visible").last();
      if (await control.count()) {
        await control.scrollIntoViewIfNeeded();
        const rect = await control.boundingBox();
        expect(rect, route).not.toBeNull();
        expect(rect!.x, route).toBeGreaterThanOrEqual(0);
        expect(rect!.x + rect!.width, route).toBeLessThanOrEqual(width + 1);
      }
    }
  });
test("the final lesson and sidebar controls remain reachable on a short laptop viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 650 });
  await page.goto("/#paths");
  await page
    .locator(".course-card")
    .filter({ hasText: "JavaScript Foundations" })
    .click();
  const last = page.locator(".lesson-row").last();
  await last.scrollIntoViewIfNeeded();
  await expect(
    last.getByRole("button", { name: "Start lesson", exact: true }),
  ).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "Resources", exact: true }),
  ).toBeInViewport();
});
