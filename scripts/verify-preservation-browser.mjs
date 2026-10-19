export default async function verifyPreservation(page) {
  const checks = [];
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
    checks.push(message);
  };
  // This seed is synthetic and belongs only to the sprout-teaching-qa profile.
  const legacy = {
    completed: ["js-welcome", "react-state"],
    bookmarks: ["react-state"],
    activity: { "2026-10-18": 30 },
    dailyGoal: 30,
    name: "Existing learner",
    projects: { greeting: { 0: true, 2: true } },
    drafts: {
      "lesson-react-state":
        "function App() { return <h1>My legacy example</h1>; }",
      "lab-JavaScript": "console.log('My legacy lab');",
      "project-greeting":
        "function App() { return <h1>My original project</h1>; }",
    },
    customField: { keep: true },
  };
  await page.evaluate(
    (seed) => localStorage.setItem("sprout-learning-v1", JSON.stringify(seed)),
    legacy,
  );
  await page.goto("http://127.0.0.1:5173/");
  const migrated = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("sprout-learning-v1")),
  );
  for (const key of Object.keys(legacy))
    assert(
      JSON.stringify(migrated[key]) === JSON.stringify(legacy[key]),
      `Legacy ${key} is preserved in the browser`,
    );
  assert(
    migrated.schemaVersion === 2,
    "The live app migrates additively to schema 2",
  );
  const backup = await page.evaluate(() =>
    JSON.parse(
      localStorage.getItem("sprout-learning-backup-before-practice-v2"),
    ),
  );
  assert(
    JSON.stringify(backup.drafts) === JSON.stringify(legacy.drafts),
    "A backup retains the original drafts",
  );
  await page.getByRole("button", { name: /^Bookmarks/ }).click();
  await page
    .getByRole("button", {
      name: "Open Remember and display a changing quantity",
      exact: true,
    })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByText("Your earlier completion is preserved.", { exact: false })
    .waitFor();
  await dialog
    .getByRole("button", { name: "Run this example", exact: true })
    .click();
  assert(
    (
      await dialog
        .getByRole("textbox", { name: "React code editor" })
        .innerText()
    ).includes("My legacy example"),
    "An updated lesson never replaces a legacy example draft",
  );
  await dialog
    .getByRole("button", { name: "Go straight to the task", exact: true })
    .click();
  const editor = dialog.getByRole("textbox", { name: "React code editor" });
  await editor.fill(
    "function App() { return <div><p>Quantity: 0</p><button>Add one</button><button>Reset</button></div>; }",
  );
  await dialog
    .getByRole("button", { name: "Check behaviour", exact: true })
    .click();
  await dialog.getByText("Here is the mismatch to work on").waitFor();
  assert(
    (await dialog.locator(".behaviour-results").innerText()).includes(
      "Quantity: 2",
    ),
    "A static-looking React solution fails with the expected state transition explained",
  );
  const solution =
    "function App() {\n const [quantity, setQuantity] = React.useState(0);\n function add() { setQuantity((previous) => previous + 1); }\n return <div><p>Quantity: {quantity}</p><button onClick={add}>Add one</button><button onClick={() => setQuantity(0)}>Reset</button></div>;\n}";
  await editor.fill(solution);
  await dialog
    .getByRole("button", { name: "Check behaviour", exact: true })
    .click();
  await dialog.getByText("These behaviour checks passed").waitFor();
  checks.push(
    "A valid alternate React handler implementation passes live interaction checks",
  );
  const frame = page.frameLocator(
    'iframe[title="Your React component preview"]',
  );
  await frame.getByRole("button", { name: "Add one", exact: true }).click();
  await frame.getByText("Quantity: 1", { exact: true }).waitFor();
  await dialog.getByRole("tab", { name: "3 Quick check" }).click();
  await dialog.getByRole("radio").nth(1).check();
  await dialog.getByRole("button", { name: "Check my answer" }).click();
  await dialog
    .getByRole("button", { name: "Next lesson", exact: true })
    .click();
  await dialog
    .getByRole("heading", {
      name: "Show available, empty, or sold-out content",
    })
    .waitFor();
  await dialog.getByRole("button", { name: "Close lesson" }).click();
  const after = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("sprout-learning-v1")),
  );
  assert(
    after.completed.length === 2 && after.activity["2026-10-18"] === 30,
    "Rechecking a legacy completion does not double-count completion or learning minutes",
  );
  assert(
    after.drafts["lesson-react-state"] === legacy.drafts["lesson-react-state"],
    "New independent drafts do not overwrite older example drafts",
  );
  await page.getByRole("button", { name: "Practice lab TRY IT" }).click();
  assert(
    (
      await page
        .getByRole("textbox", { name: "JavaScript code editor" })
        .innerText()
    ).includes("My legacy lab"),
    "The existing free-lab draft is preserved",
  );
  await page.getByRole("button", { name: "Projects", exact: true }).click();
  await page
    .getByRole("button", { name: /A greeting, with a little personality/ })
    .click();
  assert(
    (await dialog.getByRole("checkbox").nth(0).isChecked()) &&
      (await dialog.getByRole("checkbox").nth(2).isChecked()),
    "Original project checklist indices still mean the same steps",
  );
  await dialog
    .getByRole("button", { name: "Build in the practice lab" })
    .click();
  assert(
    (
      await page.getByRole("textbox", { name: "React code editor" }).innerText()
    ).includes("My original project"),
    "The original project draft is preserved",
  );
  await page.getByRole("button", { name: "Projects", exact: true }).click();
  await page
    .getByRole("button", { name: /Your shop, one calculation at a time/ })
    .click();
  await dialog.getByRole("checkbox").first().check();
  let data = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("sprout-learning-v1")),
  );
  assert(
    !data.practice["project-shop-logic"]?.passed,
    "A project checkbox cannot create verified behaviour evidence",
  );
  await dialog
    .getByRole("button", { name: "Build in the practice lab" })
    .click();
  const projectCode =
    "function cartTotal(items) { let total = 0; for (const item of items) total = total + item.price * item.quantity; return total; }\nfunction deliveryFor(total) { if (total === 0 || total >= 20) return 0; return 3; }";
  await page
    .getByRole("textbox", { name: "JavaScript code editor" })
    .fill(projectCode);
  await page
    .getByRole("button", { name: "Check behaviour", exact: true })
    .click();
  await page.getByText("These behaviour checks passed").waitFor();
  data = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("sprout-learning-v1")),
  );
  assert(
    data.practice["project-shop-logic"].passed === true,
    "A connected project stores actual boundary-check results",
  );
  assert(
    Object.values(data.projects["shop-logic"]).filter(Boolean).length === 1,
    "Passing tests does not silently mark the self-reported checklist complete",
  );
  await page.getByRole("button", { name: "Overview", exact: true }).click();
  await page.getByRole("button", { name: "Edit daily learning goal" }).click();
  await page.getByRole("button", { name: /45 min A deeper dive/ }).click();
  await page.getByRole("button", { name: "That’s my pace" }).click();
  await page.reload();
  assert(
    (await page.locator(".goal-ring").innerText()).includes("/ 45"),
    "Daily goals continue to save after migration",
  );
  await page.getByRole("button", { name: "Give it a little try" }).click();
  await dialog
    .getByRole("button", { name: "Show a hint", exact: true })
    .click();
  await dialog
    .getByRole("button", { name: "Show a more specific hint" })
    .click();
  await dialog.getByRole("button", { name: "Show explained solution" }).click();
  assert(
    (await dialog
      .getByRole("region", { name: "Daily challenge solution" })
      .count()) === 1,
    "Daily challenges retain progressive hints and a highlighted explained solution",
  );
  await page.keyboard.press("Escape");
  return { checks };
}
