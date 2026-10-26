import { test, expect } from "@playwright/test";
for (const sample of [
  { name: "phone-paths", route: "paths", width: 390, height: 844 },
  { name: "tablet-practice", route: "practice", width: 768, height: 1024 },
  { name: "laptop-overview", route: "overview", width: 1440, height: 800 },
  { name: "wide-progress", route: "progress", width: 1920, height: 1080 },
])
  test(`visual layout: ${sample.name}`, async ({ page }) => {
    await page.setViewportSize({ width: sample.width, height: sample.height });
    await page.clock.install({ time: new Date("2026-10-20T10:00:00Z") });
    await page.goto("/#" + sample.route);
    await expect(page.locator("main h1")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await expect(page).toHaveScreenshot(`${sample.name}.png`, {
      // Keep the wide comparison at its declared viewport size; text wrapping
      // otherwise changes the full-page image dimensions between platforms.
      // Responsive and data-control journeys also verify content below the fold.
      fullPage: sample.name !== "wide-progress",
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });
