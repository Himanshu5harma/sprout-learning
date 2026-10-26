import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { emptyProgress } from "../../src/learning/progress.js";
test("export, validated import, selected reset, and deletion have working UI flows", async ({
  page,
}) => {
  await page.goto("/#practice");
  await page
    .getByRole("textbox", { name: "JavaScript code editor", exact: true })
    .fill("console.log('portable draft');");
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export progress", exact: true })
    .click();
  const download = await downloadPromise;
  const data = JSON.parse(await readFile((await download.path())!, "utf8"));
  expect(data.progress.drafts["lab-JavaScript"]).toContain("portable draft");
  const input = page.getByLabel("Import Sprout progress file", { exact: true });
  await input.setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      '{"format":"sprout-progress","version":3,"progress":{"drafts":{"bad":42}}}',
    ),
  });
  await expect(page.getByText(/not a valid Sprout version 3/)).toBeVisible();
  const progress = {
    ...emptyProgress(),
    completed: ["js-welcome"],
    drafts: { "lab-JavaScript": "console.log('imported alternative');" },
    practice: {
      "exercise-js-welcome-independent": {
        passed: true,
        revision: 2,
        fingerprint: "legacy",
      },
    },
  };
  await input.setInputFiles({
    name: "valid.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        format: "sprout-progress",
        version: 3,
        exportedAt: new Date().toISOString(),
        progress,
      }),
    ),
  });
  await expect(page.getByText(/Valid progress merged/)).toBeVisible();
  await expect(
    page.getByText("Draft versions need your choice", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Reset check evidence", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Cancel", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Reset check evidence", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Reset selected data", exact: true })
    .click();
  await expect(page.getByText(/1 lessons completed/)).toBeVisible();
  await page
    .getByRole("button", { name: "Delete local learning data", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("button", { name: "Delete confirmed data" }),
  ).toBeDisabled();
  await dialog.getByLabel("Type DELETE to confirm").fill("DELETE");
  await dialog.getByRole("button", { name: "Delete confirmed data" }).click();
  await expect(page.getByText(/0 lessons completed/)).toBeVisible();
});
test("malformed saved JSON is retained with an explicit recovery state", async ({
  page,
}) => {
  const raw = '{"drafts":';
  await page.addInitScript(
    (raw) => localStorage.setItem("sprout-learning-v1", raw),
    raw,
  );
  await page.goto("/#overview");
  await expect(
    page.getByText("Original save kept for recovery").first(),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("sprout-learning-v1")),
  ).toBe(raw);
  expect(
    await page.evaluate(() =>
      localStorage.getItem("sprout-learning-backup-before-practice-v2"),
    ),
  ).toBe(raw);
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  await page
    .getByLabel("Import Sprout progress file", { exact: true })
    .setInputFiles({
      name: "recovery.json",
      mimeType: "application/json",
      buffer: Buffer.from(
        JSON.stringify({
          format: "sprout-progress",
          version: 3,
          exportedAt: new Date().toISOString(),
          progress: {
            ...emptyProgress(),
            drafts: { "lab-JavaScript": "console.log('recovered work');" },
          },
        }),
      ),
    });
  await expect(page.getByText(/Valid progress merged/)).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: /^Practice lab/ }).click();
  await expect(
    page.getByRole("textbox", { name: "JavaScript code editor", exact: true }),
  ).toContainText("recovered work");
  expect(
    await page.evaluate(() => localStorage.getItem("sprout-learning-v1")),
  ).toBe(raw);
});
test("resetting drafts updates an editor already open in another tab", async ({
  page,
  context,
}) => {
  await page.goto("/#practice");
  const editor = page.getByRole("textbox", {
    name: "JavaScript code editor",
    exact: true,
  });
  await editor.fill("console.log('old draft must disappear');");
  const second = await context.newPage();
  await second.goto("/#progress");
  await second
    .getByRole("button", { name: "Reset code drafts", exact: true })
    .click();
  await second
    .getByRole("dialog")
    .getByRole("button", { name: "Reset selected data", exact: true })
    .click();
  await expect(editor).not.toContainText("old draft must disappear");
});
