import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
test("JavaScript and React run under the documented production CSP", async ({
  page,
  context,
}) => {
  const lines = (await readFile("public/_headers", "utf8"))
    .split("\n")
    .filter((line) => line.startsWith("  "));
  const headers = Object.fromEntries(
    lines.map((line) => {
      const index = line.indexOf(":");
      return [line.slice(2, index), line.slice(index + 1).trim()];
    }),
  );
  await context.route("**/*", async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      headers: { ...response.headers(), ...headers },
    });
  });
  await page.goto("/#practice");
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await expect(page.locator(".console-output")).toContainText("Tea");
  await page.getByRole("button", { name: "React", exact: true }).click();
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await expect(
    page
      .frameLocator("iframe")
      .getByRole("heading", { name: "Your first shop", exact: true }),
  ).toBeVisible();
});
