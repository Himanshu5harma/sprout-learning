import { test, expect } from "@playwright/test";
const solution = "console.log('Welcome');\nconsole.log('Shop is open');";
async function openWelcome(page: import("@playwright/test").Page) {
  await page.goto("/#overview");
  await page
    .getByRole("button", { name: "Let’s start learning", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
}
test("learning checks, stale drafts, completion, bookmarks, and history survive reload", async ({
  page,
}) => {
  await openWelcome(page);
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("button", { name: "Bookmark lesson", exact: true })
    .click();
  await dialog
    .getByRole("button", { name: "Try the task", exact: true })
    .click();
  const editor = dialog.getByRole("textbox", {
    name: "JavaScript code editor",
    exact: true,
  });
  await editor.fill(solution);
  await dialog
    .getByRole("button", { name: "Check behaviour", exact: true })
    .click();
  await expect(
    dialog.getByText("These behaviour checks passed", { exact: true }),
  ).toBeVisible();
  await dialog.getByRole("tab", { name: "3 Quick check", exact: true }).click();
  await dialog.getByRole("radio").first().check();
  await dialog.getByRole("button", { name: "Check my answer" }).click();
  await expect(
    dialog.getByRole("button", { name: "Complete lesson", exact: true }),
  ).toBeEnabled();
  await dialog.getByRole("tab", { name: "2 Practice", exact: true }).click();
  await editor.fill("console.log('edited');");
  await dialog.getByRole("tab", { name: "3 Quick check", exact: true }).click();
  await expect(
    dialog.getByRole("button", { name: "Complete lesson", exact: true }),
  ).toBeDisabled();
  await dialog
    .getByRole("button", { name: "Open the independent exercise" })
    .click();
  await editor.fill(solution);
  await dialog
    .getByRole("button", { name: "Check behaviour", exact: true })
    .click();
  await expect(
    dialog.getByText("These behaviour checks passed", { exact: true }),
  ).toBeVisible();
  await dialog.getByRole("tab", { name: "3 Quick check", exact: true }).click();
  await dialog
    .getByRole("button", { name: "Complete lesson", exact: true })
    .click();
  await expect(
    dialog.getByRole("heading", {
      name: "Values: text, numbers, and yes-or-no answers",
      exact: true,
    }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Close lesson" }).click();
  await page.reload();
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  await page.getByRole("tab", { name: "Lesson evidence", exact: true }).click();
  const row = page
    .locator(".evidence-list > li")
    .filter({ hasText: "Your browser, your console, your first result" });
  await expect(row).toContainText("Completed · historical milestone");
  await expect(row).toContainText("Practical check · independent");
  await expect(row).toContainText("Knowledge check · passed");
  await page.getByRole("tab", { name: "Learning history" }).click();
  await expect(page.locator(".history-list")).toContainText("Lesson completed");
  await page.getByRole("button", { name: /^Bookmarks/ }).click();
  await expect(
    page.getByRole("heading", {
      name: "Your browser, your console, your first result",
      exact: true,
    }),
  ).toBeVisible();
});
test("draft survives immediate reload and two tabs retain conflicting copies", async ({
  page,
  context,
}) => {
  await page.goto("/#practice");
  const editor = page.getByRole("textbox", {
    name: "JavaScript code editor",
    exact: true,
  });
  await editor.fill("console.log('before reload');");
  await page.reload();
  await expect(editor).toContainText("before reload");
  const second = await context.newPage();
  await second.goto("/#practice");
  await expect(
    second.getByRole("textbox", {
      name: "JavaScript code editor",
      exact: true,
    }),
  ).toContainText("before reload");
  // Both tabs edit before the 250 ms commit, exercising the common-base conflict path.
  await Promise.all([
    editor.fill("console.log('first tab');"),
    second
      .getByRole("textbox", { name: "JavaScript code editor", exact: true })
      .fill("console.log('second tab');"),
  ]);
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  await expect(
    page.getByText("Draft versions need your choice", { exact: true }),
  ).toBeVisible();
  await expect(
    page.locator(".conflict-code").filter({ hasText: "first tab" }),
  ).toBeVisible();
  await expect(
    page.locator(".conflict-code").filter({ hasText: "second tab" }),
  ).toBeVisible();
});
test("legacy IDs, drafts and checklists migrate without replacing the original save", async ({
  page,
}) => {
  const original = {
    completed: ["js-welcome"],
    drafts: { "lab-JavaScript": "console.log('legacy kept');" },
    projects: { greeting: { 0: true, 2: true } },
    bookmarks: ["js-functions"],
    name: "Learner",
    dailyGoal: 30,
    activity: { "2026-10-18": 30 },
  };
  await page.addInitScript((data) => {
    if (!localStorage.getItem("sprout-learning-v1"))
      localStorage.setItem("sprout-learning-v1", JSON.stringify(data));
  }, original);
  await page.goto("/#practice");
  await expect(
    page.getByRole("textbox", { name: "JavaScript code editor", exact: true }),
  ).toContainText("legacy kept");
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("sprout-learning-v1")!),
    ),
  ).toEqual(original);
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  await expect(page.getByText(/1 lessons completed/)).toBeVisible();
  await page.getByRole("tab", { name: "Lesson evidence", exact: true }).click();
  await expect(page.locator(".evidence-list > li").first()).toContainText(
    "Completed · historical milestone",
  );
});
test("stop, navigation, and a new run prevent stale execution results", async ({
  page,
}) => {
  await page.goto("/#practice");
  const editor = page.getByRole("textbox", {
    name: "JavaScript code editor",
    exact: true,
  });
  await editor.fill("while(true){}");
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await page.getByRole("button", { name: "Stop", exact: true }).click();
  await editor.fill("console.log('new result');");
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await expect(page.locator(".console-output")).toContainText("new result");
  await page.getByRole("button", { name: "React", exact: true }).click();
  await page
    .getByRole("textbox", { name: "React code editor", exact: true })
    .fill(
      'function App(){React.useEffect(()=>{const id=setInterval(()=>console.log("tick"),30);return()=>clearInterval(id)},[]);return <p>Timer preview</p>}',
    );
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await expect(
    page.frameLocator("iframe").getByText("Timer preview"),
  ).toBeVisible();
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Your learning, made visible." }),
  ).toBeVisible();
});
test("optional hints, explained solutions, and assistance remain separate from independent evidence", async ({
  page,
}) => {
  await openWelcome(page);
  const dialog = page.getByRole("dialog");
  await expect(dialog.locator(".sprout-string").first()).toBeVisible();
  await dialog
    .getByRole("button", { name: "Try the task", exact: true })
    .click();
  await dialog
    .getByRole("button", { name: "Show a conceptual hint", exact: true })
    .click();
  await dialog
    .getByRole("button", { name: "Show a more specific hint", exact: true })
    .click();
  await dialog
    .getByRole("button", { name: "Show explained solution", exact: true })
    .click();
  await expect(dialog.getByText(/not evidence of an/)).toBeVisible();
  await dialog
    .getByRole("textbox", { name: "JavaScript code editor", exact: true })
    .fill(solution);
  await dialog
    .getByRole("button", { name: "Check behaviour", exact: true })
    .click();
  await expect(
    dialog.getByText("These behaviour checks passed", { exact: true }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Close lesson" }).click();
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  await page.getByRole("tab", { name: "Lesson evidence", exact: true }).click();
  await expect(page.locator(".evidence-list > li").first()).toContainText(
    "Practical check · assisted",
  );
});
test("an already loaded editor keeps saving locally while offline", async ({
  page,
  context,
}) => {
  await page.goto("/#practice");
  const editor = page.getByRole("textbox", {
    name: "JavaScript code editor",
    exact: true,
  });
  await expect(editor).toBeVisible();
  await context.setOffline(true);
  await editor.fill("console.log('offline draft');");
  await expect(
    page
      .locator(".editor-footer")
      .getByText(/Offline; local editing available/),
  ).toBeVisible();
  await expect(page.locator(".editor-footer .save-saved")).toContainText(
    "Saved on this device",
  );
  await context.setOffline(false);
  await page.reload();
  await expect(editor).toContainText("offline draft");
});
test("closing an edited lesson refreshes dashboard and stale-evidence badges", async ({
  page,
}) => {
  await openWelcome(page);
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("button", { name: "Try the task", exact: true })
    .click();
  const editor = dialog.getByRole("textbox", {
    name: "JavaScript code editor",
    exact: true,
  });
  await editor.fill(solution);
  await dialog
    .getByRole("button", { name: "Check behaviour", exact: true })
    .click();
  await expect(
    dialog.getByText("These behaviour checks passed", { exact: true }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Close lesson" }).click();
  let stat = page
    .locator(".stat-card")
    .filter({ hasText: "Current practical checks" });
  await expect(stat.locator(".stat-value")).toContainText("1");
  await page
    .getByRole("button", { name: "Resume your learning", exact: true })
    .click();
  await dialog.getByRole("tab", { name: "2 Practice", exact: true }).click();
  await editor.fill("console.log('changed after checking');");
  await dialog.getByRole("button", { name: "Close lesson" }).click();
  stat = page
    .locator(".stat-card")
    .filter({ hasText: "Current practical checks" });
  await expect(stat.locator(".stat-value")).toContainText("0");
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  await page.getByRole("tab", { name: "Lesson evidence", exact: true }).click();
  await expect(page.locator(".evidence-list>li").first()).toContainText(
    "Practical check · recheck required",
  );
});
