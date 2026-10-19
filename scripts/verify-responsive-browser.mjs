export default async function verifyResponsive(page) {
  const checks = [];
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
    checks.push(message);
  };
  const openStateLesson = async () => {
    await page.getByRole("button", { name: "Edit your profile" }).waitFor();
    await page.keyboard.press("Control+k");
    await page
      .getByRole("textbox", { name: "Search lessons" })
      .fill("Remember and display a changing quantity");
    await page.locator(".search-result").first().click();
  };
  await page.goto("http://127.0.0.1:5173/");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openStateLesson();
  let dialog = page.getByRole("dialog");
  assert(
    (await dialog.locator(".sprout-keyword").count()) > 0 &&
      (await dialog.locator(".sprout-number").count()) > 0,
    "React code distinguishes keywords and numeric values",
  );
  await page.screenshot({
    path: "output/playwright/lesson-concise-desktop.png",
    animations: "disabled",
  });
  await dialog
    .getByText("Explain the code, line by line", { exact: true })
    .click();
  await dialog.locator(".line-explanation").nth(1).click();
  const alignment = await dialog.evaluate((el) => {
    const line = el.querySelector(".cm-content .cm-line");
    const gutter = [
      ...el.querySelectorAll(".cm-lineNumbers .cm-gutterElement"),
    ].find(
      (item) =>
        item.textContent === "1" &&
        getComputedStyle(item).visibility !== "hidden",
    );
    return Math.abs(
      line.getBoundingClientRect().top - gutter.getBoundingClientRect().top,
    );
  });
  assert(alignment < 4, "Code line numbers align with their source lines");
  await page.screenshot({
    path: "output/playwright/lesson-teaching-final-desktop.png",
    animations: "disabled",
  });
  await dialog.getByRole("tab", { name: "2 Practice" }).click();
  const editor = dialog.getByRole("textbox", { name: "React code editor" });
  await editor.fill(
    "function App() {\n  // Cart quantity stays in state.\n  const [quantity, setQuantity] = React.useState(0);\n  return <div><p>Quantity: {quantity}</p><button onClick={() => setQuantity((q) => q + 1)}>Add one</button><button onClick={() => setQuantity(0)}>Reset</button></div>;\n}",
  );
  await dialog
    .getByRole("button", { name: "Check behaviour", exact: true })
    .click();
  await dialog.getByText("These behaviour checks passed").waitFor();
  const colours = await editor.evaluate((el) => {
    const rgb = (value) =>
      value
        .match(/[\d.]+/g)
        .slice(0, 3)
        .map(Number)
        .map((channel) => {
          const c = channel / 255;
          return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
    const lum = (value) => {
      const c = rgb(value);
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    };
    const background = lum("rgb(29,43,41)");
    return [
      ...new Set(
        [...el.querySelectorAll('[class*="sprout-"]')].map(
          (node) => getComputedStyle(node).color,
        ),
      ),
    ].map((color) => {
      const foreground = lum(color);
      return {
        color,
        ratio:
          (Math.max(foreground, background) + 0.05) /
          (Math.min(foreground, background) + 0.05),
      };
    });
  });
  assert(
    colours.length >= 5 && colours.every((item) => item.ratio >= 4.5),
    "Syntax colours, including comments, meet 4.5:1 contrast on the editor background",
  );
  await page.screenshot({
    path: "output/playwright/practice-final-desktop.png",
    animations: "disabled",
  });
  for (const width of [390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    assert(
      await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
      `${width}px lesson and editor have no outer horizontal overflow`,
    );
    const run = dialog.getByRole("button", { name: "Run code", exact: true });
    await run.scrollIntoViewIfNeeded();
    const box = await run.boundingBox();
    assert(
      box.x >= 0 && box.x + box.width <= width,
      `${width}px Run code control is not clipped`,
    );
    if (width === 390)
      await page.screenshot({
        path: "output/playwright/practice-final-mobile.png",
        animations: "disabled",
      });
  }
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.getByRole("button", { name: "Projects", exact: true }).click();
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Phone project list fits without horizontal overflow",
  );
  await page
    .getByRole("button", { name: /Bring your shop to the screen/ })
    .click();
  dialog = page.getByRole("dialog");
  assert(
    await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    "Phone project instructions and prerequisite links fit the dialog",
  );
  await page.screenshot({
    path: "output/playwright/project-final-mobile.png",
    animations: "disabled",
  });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.getByRole("button", { name: "Overview", exact: true }).click();
  await page.screenshot({
    path: "output/playwright/overview-preserved-mobile.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "output/playwright/overview-preserved-desktop.png",
    fullPage: true,
    animations: "disabled",
  });
  return { checks, syntaxContrast: colours };
}
