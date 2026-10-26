import { test, expect } from "@playwright/test";
test("JavaScript executes and React renders interactive state", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") console.log("browser error:", m.text());
  });
  await page.goto("/#practice");
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await expect(page.locator(".console-output")).toContainText("Tea");
  await page.getByRole("button", { name: "React", exact: true }).click();
  const code =
    "function App(){const [n,setN]=React.useState(0);return <div><p>Count {n}</p><button onClick={()=>setN(n+1)}>Add</button></div>}";
  await page
    .getByRole("textbox", { name: "React code editor", exact: true })
    .fill(code);
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  const frame = page.frameLocator("iframe");
  await expect(frame.getByText("Count 0", { exact: true })).toBeVisible();
  await frame.getByRole("button", { name: "Add", exact: true }).click();
  await expect(frame.getByText("Count 1", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
