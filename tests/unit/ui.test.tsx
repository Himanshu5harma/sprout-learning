import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { useState } from "react";
import { Field, Tabs } from "../../src/ui/primitives";
import {
  frameMessageSchema,
  resultSchema,
  commandSchema,
} from "../../src/execution/protocol";
it("labels fields and supports arrow/home/end tab navigation", async () => {
  function Example() {
    const [tab, setTab] = useState("Learn");
    return (
      <>
        <Field label="Name" help="Optional" />
        <Tabs
          items={["Learn", "Practice", "Check"]}
          value={tab}
          onChange={setTab}
          label="Lesson sections"
        />
      </>
    );
  }
  render(<Example />);
  expect(screen.getByLabelText("Name")).toHaveAccessibleDescription("Optional");
  const user = userEvent.setup();
  await user.click(screen.getByRole("tab", { name: "Learn" }));
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("tab", { name: "Practice" })).toHaveFocus();
  expect(screen.getByRole("tab", { name: "Practice" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await user.keyboard("{End}");
  expect(screen.getByRole("tab", { name: "Check" })).toHaveFocus();
  await user.keyboard("{Home}");
  expect(screen.getByRole("tab", { name: "Learn" })).toHaveFocus();
});
it("rejects malformed runtime results, unknown commands, and oversized logs", () => {
  expect(
    resultSchema.safeParse({
      lines: [],
      checks: [{ label: "x", passed: "yes" }],
    }).success,
  ).toBe(false);
  expect(
    commandSchema.safeParse({ type: "event", event: "navigate", id: 1 })
      .success,
  ).toBe(false);
  expect(
    frameMessageSchema.safeParse({
      type: "sprout-preview-log",
      line: "x".repeat(8001),
    }).success,
  ).toBe(false);
});
it("restores page scrolling after overlapping dialogs close out of order", async () => {
  const { lockPageScroll } = await import("../../src/ui/scroll-lock");
  document.body.style.overflow = "auto";
  const releaseFirst = lockPageScroll();
  const releaseSecond = lockPageScroll();
  releaseFirst();
  expect(document.body.style.overflow).toBe("hidden");
  releaseSecond();
  expect(document.body.style.overflow).toBe("auto");
  releaseSecond();
  const next = lockPageScroll();
  expect(document.body.style.overflow).toBe("hidden");
  next();
  expect(document.body.style.overflow).toBe("auto");
  document.body.style.overflow = "";
});
