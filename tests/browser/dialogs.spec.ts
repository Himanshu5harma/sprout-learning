import { test, expect, type Page } from "@playwright/test";

async function expectCentered(page: Page) {
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect
    .poll(
      async () => {
        const bounds = await dialog.boundingBox();
        const viewport = page.viewportSize()!;
        return (
          !!bounds &&
          Math.abs(bounds.x + bounds.width / 2 - viewport.width / 2) <= 1 &&
          Math.abs(bounds.y + bounds.height / 2 - viewport.height / 2) <= 1 &&
          bounds.x >= 0 &&
          bounds.y >= 0 &&
          bounds.x + bounds.width <= viewport.width + 1 &&
          bounds.y + bounds.height <= viewport.height + 1
        );
      },
      { message: "Dialog should be centered and fit inside the viewport" },
    )
    .toBe(true);
}

for (const viewport of [
  { width: 320, height: 640 },
  { width: 768, height: 1024 },
  { width: 1440, height: 650 },
  { width: 1920, height: 1080 },
]) {
  test(`dialogs stay centered at ${viewport.width} × ${viewport.height}, including after scrolling`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/#overview");
    await expect(page.locator("main h1")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);

    for (const name of [
      "Edit your profile",
      "Edit daily learning goal",
      "Search lessons",
    ]) {
      await page.getByRole("button", { name, exact: true }).click();
      await expectCentered(page);
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toHaveCount(0);
    }

    // The challenge opens from farther down the page and exceeds short viewports.
    await page
      .getByRole("button", { name: "Give it a little try", exact: true })
      .click();
    await expect(
      page.getByRole("textbox", {
        name: "JavaScript code editor",
        exact: true,
      }),
    ).toBeVisible();
    await expectCentered(page);
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Show explained solution", exact: true })
      .scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("button", {
        name: "Show explained solution",
        exact: true,
      }),
    ).toBeInViewport();
    await expectCentered(page);
    await page.keyboard.press("Escape");

    await page
      .getByRole("button", { name: "Let’s start learning", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Close lesson", exact: true }),
    ).toBeVisible();
    await expectCentered(page);
    await page.keyboard.press("Escape");

    await page.goto("/#projects");
    await page.locator(".project-card").first().click();
    await expectCentered(page);
    await page.keyboard.press("Escape");

    await page.goto("/#progress");
    await page
      .getByRole("button", { name: "Reset code drafts", exact: true })
      .click();
    await expectCentered(page);
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
}
