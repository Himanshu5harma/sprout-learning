import { test, expect } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
for (const route of [
  "overview",
  "paths",
  "practice",
  "projects",
  "bookmarks",
  "progress",
  "resources",
])
  test(`${route} has no automated WCAG A/AA violations`, async ({
    page,
  }, info) => {
    await page.goto("/#" + route);
    await expect(page.locator("main h1")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    await writeFile(
      info.outputPath("axe.json"),
      JSON.stringify(results.violations),
    );
    expect(
      results.violations.map((item) => ({
        id: item.id,
        nodes: item.nodes
          .map((node) => ({
            target: node.target,
            summary: node.failureSummary,
          }))
          .slice(0, 10),
      })),
    ).toEqual([]);
  });
test("lesson dialog supports keyboard sections, editor exit, escape, and focus restoration", async ({
  page,
}) => {
  await page.goto("/#overview");
  const opener = page.getByRole("button", {
    name: "Let’s start learning",
    exact: true,
  });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes
        .map((n) => ({ target: n.target, summary: n.failureSummary }))
        .slice(0, 10),
    })),
  ).toEqual([]);
  await dialog.getByRole("tab", { name: "1 Learn", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    dialog.getByRole("tab", { name: "2 Practice", exact: true }),
  ).toBeFocused();
  const editor = dialog.getByRole("textbox", {
    name: "JavaScript code editor",
    exact: true,
  });
  await editor.focus();
  await page.keyboard.press("Tab");
  await expect(editor).not.toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});
test("phone navigation is keyboard accessible and closed links cannot receive focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#overview");
  await expect(page.locator("main h1")).toBeVisible();
  const trigger = page.getByRole("button", { name: "Toggle navigation" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(
      () => document.activeElement?.closest("aside") === null,
    ),
  ).toBe(true);
});
test("goal, profile, and search dialogs expose names, choices, and readable content", async ({
  page,
}) => {
  await page.goto("/#overview");
  await page
    .getByRole("button", { name: "Edit daily learning goal", exact: true })
    .click();
  let dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: /15 min/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await dialog.getByRole("button", { name: /30 min/ }).press("Enter");
  await expect(dialog.getByRole("button", { name: /30 min/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  let results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  ).toEqual([]);
  await dialog
    .getByRole("button", { name: "That’s my pace", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Edit your profile", exact: true })
    .click();
  dialog = page.getByRole("dialog");
  await dialog.getByLabel("Your first name", { exact: true }).fill("Learner");
  results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await dialog
    .getByRole("button", { name: "Make it mine", exact: true })
    .press("Enter");
  await expect(page.locator("main h1")).toContainText("Learner");
  await page
    .getByRole("button", { name: "Search lessons", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
