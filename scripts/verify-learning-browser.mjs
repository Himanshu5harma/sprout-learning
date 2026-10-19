// Invoked through the Playwright CLI, not the Playwright test runner.
// Uses its own named browser profile; never clears learner storage.
export default async function verifyLearning(page) {
  const checks = [];
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
    checks.push(message);
  };
  const dialog = () => page.getByRole("dialog");
  const editor = () =>
    dialog().getByRole("textbox", { name: "JavaScript code editor" });
  const storage = () =>
    page.evaluate(() => JSON.parse(localStorage.getItem("sprout-learning-v1")));
  await page.goto("http://127.0.0.1:5173/");
  await page
    .getByRole("button", { name: "Let’s start learning", exact: true })
    .click();
  assert(
    (await dialog().locator(".sprout-string").count()) > 0,
    "Read-only examples have syntax highlighting",
  );
  assert(
    (await dialog().locator(".lesson-plain > p").innerText()).split(/\s+/)
      .length <= 55 &&
      !(await dialog()
        .locator(".lesson-deeper")
        .evaluate((el) => el.open)),
    "The default lesson has a short explanation with detail available on demand",
  );
  await dialog()
    .getByText("Explain the code, line by line", { exact: true })
    .click();
  await dialog().locator(".line-explanation").first().click();
  assert(
    (await dialog().locator(".cm-discussed-line").count()) === 1,
    "An explanation marks its discussed line",
  );
  if (
    await dialog()
      .getByRole("button", { name: "Bookmark lesson", exact: true })
      .count()
  )
    await dialog()
      .getByRole("button", { name: "Bookmark lesson", exact: true })
      .click();
  await dialog()
    .getByRole("button", { name: "Try the task", exact: true })
    .click();
  assert(
    (await dialog().locator(".practice-task").isVisible()) &&
      !(await dialog()
        .locator(".optional-warmups")
        .evaluate((el) => el.open)),
    "Learners go directly to one task without completing warm-up steps",
  );
  await dialog().getByRole("tab", { name: "1 Learn" }).click();
  await dialog()
    .getByRole("button", { name: "Run this example", exact: true })
    .click();
  await dialog().getByRole("button", { name: "Run code", exact: true }).click();
  await dialog()
    .locator(".console-output")
    .filter({ hasText: "Tea" })
    .waitFor();
  assert(
    (await editor().locator(".sprout-string").count()) > 0,
    "Editable code is highlighted while typing",
  );
  await editor().focus();
  await page.keyboard.press("Tab");
  assert(
    !(await editor().evaluate((el) => el === document.activeElement)),
    "Tab can leave the editor without a keyboard trap",
  );
  await dialog().locator(".practice-stages button").nth(1).click();
  await dialog().getByRole("textbox", { name: "Your prediction" }).fill("Tea");
  await dialog().getByRole("button", { name: "Check my prediction" }).click();
  await dialog()
    .getByText("Compare the steps with the expected result.")
    .waitFor();
  await dialog()
    .getByRole("textbox", { name: "Your prediction" })
    .fill("Coffee\nReady");
  await dialog().getByRole("button", { name: "Check my prediction" }).click();
  await dialog().getByText("Your prediction matches.").waitFor();
  checks.push(
    "Prediction feedback explains a mismatch and accepts a corrected answer",
  );
  await dialog().locator(".practice-stages button").nth(2).click();
  await dialog()
    .getByRole("button", { name: "Check behaviour", exact: true })
    .click();
  await dialog().getByText("Here is the mismatch to work on").waitFor();
  await editor().fill("console.log('Coffee');");
  await dialog()
    .getByRole("button", { name: "Check behaviour", exact: true })
    .click();
  await dialog().getByText("These behaviour checks passed").waitFor();
  checks.push("Guided checks accept a valid alternative quote style");
  await dialog().locator(".practice-stages button").nth(4).click();
  await dialog()
    .getByRole("button", { name: "Show a conceptual hint" })
    .click();
  await dialog()
    .getByRole("button", { name: "Show a more specific hint" })
    .click();
  await dialog()
    .getByRole("button", { name: "Show explained solution" })
    .click();
  assert(
    (await storage()).practice["exercise-js-welcome-debug"].assisted === true,
    "Solution viewing is saved as assistance",
  );
  await dialog().locator(".practice-stages button").nth(5).click();
  const correct = "console.log('Welcome');\nconsole.log('Shop is open');";
  await editor().fill(correct);
  await dialog()
    .getByRole("button", { name: "Check behaviour", exact: true })
    .click();
  await dialog().getByText("These behaviour checks passed").waitFor();
  await dialog()
    .getByText("Optional: explain your solution", { exact: true })
    .click();
  await dialog()
    .getByRole("textbox", { name: "Your explanation of this lesson" })
    .fill(
      "Each log prints its own string. The second instruction runs after the first.",
    );
  await editor().fill("console.log('Wrong');");
  await dialog().getByRole("tab", { name: "3 Quick check" }).click();
  await dialog().getByRole("radio").first().check();
  await dialog().getByRole("button", { name: "Check my answer" }).click();
  assert(
    await dialog()
      .getByRole("button", { name: "Complete lesson", exact: true })
      .isDisabled(),
    "A quiz alone cannot complete a lesson, and editing makes old practical evidence stale",
  );
  await dialog()
    .getByRole("button", { name: "Open the independent exercise" })
    .click();
  assert(
    (await editor().innerText()).includes("Wrong"),
    "Independent exercise drafts survive section changes",
  );
  await editor().fill(correct);
  await dialog()
    .getByRole("button", { name: "Check behaviour", exact: true })
    .click();
  await dialog().getByText("These behaviour checks passed").waitFor();
  await dialog().getByRole("tab", { name: "3 Quick check" }).click();
  await dialog()
    .getByRole("button", { name: "Complete lesson", exact: true })
    .click();
  await dialog()
    .getByRole("heading", {
      name: "Values: text, numbers, and yes-or-no answers",
    })
    .waitFor();
  await dialog().getByRole("button", { name: "Close lesson" }).click();
  await page.reload();
  const saved = await storage();
  assert(
    saved.completed.includes("js-welcome") &&
      saved.practice["exercise-js-welcome-independent"].passed,
    "Completion and practical evidence survive reload",
  );
  assert(
    saved.bookmarks.includes("js-welcome") &&
      saved.reflections["js-welcome"].includes("Each log"),
    "Bookmarks and self-explanation survive reload",
  );
  await page.getByRole("button", { name: /^Bookmarks/ }).click();
  await page
    .getByRole("heading", {
      name: "Your browser, your console, your first result",
      exact: true,
    })
    .waitFor();
  checks.push("The bookmarks collection still opens the revised lesson ID");
  return { checks };
}
