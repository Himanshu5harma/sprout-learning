// Run through the Playwright CLI in a separate sprout-teaching-production profile.
export default async function verifyProduction(page) {
  const checks = [];
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
    checks.push(message);
  };
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:4173/");
  await page.getByRole("button", { name: "Edit your profile" }).waitFor();
  await page.getByRole("button", { name: "Practice lab TRY IT" }).click();
  const jsEditor = page.getByRole("textbox", {
    name: "JavaScript code editor",
  });
  await jsEditor.fill('console.log("Production worker ready");');
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await page
    .locator(".console-output")
    .filter({ hasText: "Production worker ready" })
    .waitFor();
  checks.push(
    "The production worker runs code and displays its console output",
  );
  await jsEditor.fill(
    'await new Promise((resolve) => setTimeout(resolve, 1500)); console.log("Late output");',
  );
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await page.getByRole("button", { name: "Stop", exact: true }).click();
  await page.getByRole("button", { name: "Run code", exact: true }).waitFor();
  assert(
    !(await page.locator(".console-output").innerText()).includes(
      "Late output",
    ),
    "Stop cancels a pending worker without replacing the draft",
  );
  await jsEditor.fill("console.log(document.title);");
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await page
    .getByText("This console has no page to change.", { exact: true })
    .waitFor();
  await page.getByText("Technical detail", { exact: true }).click();
  assert(
    (await page.locator(".learning-error").innerText()).includes(
      "document is not defined",
    ),
    "Worker limitations have a plain explanation and preserve the original error",
  );
  await page.keyboard.press("Control+k");
  await page
    .getByRole("textbox", { name: "Search lessons" })
    .fill("Read and submit a controlled input");
  await page.locator(".search-result").first().click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("tab", { name: "2 Practice" }).click();
  const editor = dialog.getByRole("textbox", { name: "React code editor" });
  const solution =
    'import React, { useState } from "react";\nexport default function App() {\n  const [note, setNote] = useState("");\n  const [saved, setSaved] = useState("");\n  return <form onSubmit={(event) => { event.preventDefault(); setSaved(note); }}>\n    <label htmlFor="note">Order note</label>\n    <input id="note" value={note} onChange={(event) => setNote(event.target.value)} />\n    <button type="submit">Save note</button>\n    <p>Saved: {saved}</p>\n  </form>;\n}';
  await editor.fill(solution.replace("event.preventDefault(); ", ""));
  await dialog
    .getByRole("button", { name: "Check behaviour", exact: true })
    .click();
  await dialog
    .getByText("Here is the mismatch to work on", { exact: true })
    .waitFor();
  await dialog
    .getByText("The form needs to stay on this page.", { exact: true })
    .waitFor();
  let data = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("sprout-learning-v1")),
  );
  assert(
    data.practice["exercise-react-forms-independent"]?.passed === false,
    "The navigation guard cannot falsely pass a form missing preventDefault",
  );
  await editor.fill(solution);
  await dialog
    .getByRole("button", { name: "Check behaviour", exact: true })
    .click();
  await dialog
    .getByText("These behaviour checks passed", { exact: true })
    .waitFor();
  assert(
    (await dialog.locator(".learning-error").count()) === 0,
    "Fixing the form clears its error and passes two different submissions",
  );
  checks.push(
    "The production compiler supports JSX, default exports, and default/named React imports",
  );
  const frame = page.frameLocator(
    'iframe[title="Your React component preview"]',
  );
  await frame
    .getByRole("textbox", { name: "Order note" })
    .fill("Checked manually");
  await frame.getByRole("button", { name: "Save note" }).click();
  await frame.getByText("Saved: Checked manually", { exact: true }).waitFor();
  checks.push("The post-check production preview remains interactive");
  data = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("sprout-learning-v1")),
  );
  assert(
    data.practice["exercise-react-forms-independent"].passed === true &&
      data.drafts["exercise-react-forms-independent"] === solution,
    "The production app saves the checked code and its practical evidence",
  );
  await editor.fill(
    'import missing from "another-package";\nfunction App() { return <p>{missing}</p>; }',
  );
  await dialog.getByRole("button", { name: "Run code", exact: true }).click();
  await dialog
    .getByText("This small preview does not include that package.", {
      exact: true,
    })
    .waitFor();
  checks.push(
    "Unsupported React packages get a useful local-project explanation",
  );
  await page.keyboard.press("Escape");
  await page.reload();
  assert(
    errors.length === 0,
    `The production app has no uncaught page errors: ${errors.join("; ")}`,
  );
  return { checks, errors };
}
