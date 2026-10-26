import { test, expect } from "@playwright/test";
import { z } from "zod";
import {
  allLessons as rawLessons,
  projects as rawProjects,
} from "../../src/curriculum.js";
import {
  lessonContentSchema,
  projectSchema,
} from "../../src/domain/curriculum";
const lessons = z.array(lessonContentSchema).parse(rawLessons);
const projects = z.array(projectSchema).parse(rawProjects);
for (const id of [
  "react-forms",
  "react-quality",
  "react-transitions",
  "react-suspense",
  "react-refs",
  "react-effects",
  "react-async-ui",
])
  test(`isolated renderer preserves ${id} behaviour`, async ({ page }) => {
    await page.goto("/tests/browser/harness.html");
    await page.waitForFunction(() => !!window.runFixture);
    const task = lessons.find((lesson) => lesson.id === id)!.teaching
      .independent;
    const result = await page.evaluate(
      (task) =>
        window.runFixture(
          {
            id: "contract",
            code: task.solution,
            checks: task.checks,
            expectedPass: true,
          },
          "React",
        ),
      task,
    );
    expect(result.error).toBeUndefined();
    expect(result.checks.length).toBe(task.checks.length);
    expect(result.checks.filter((check) => !check.passed)).toEqual([]);
  });
test("task project supports native form submission and removal", async ({
  page,
}) => {
  await page.goto("/tests/browser/harness.html");
  await page.waitForFunction(() => !!window.runFixture);
  const task = projects.find((project) => project.id === "tasks")!.task;
  const result = await page.evaluate(
    (task) =>
      window.runFixture(
        {
          id: "tasks",
          code: task.solution,
          checks: task.checks,
          expectedPass: true,
        },
        "React",
      ),
    task,
  );
  expect(result.error).toBeUndefined();
  expect(result.checks.filter((check) => !check.passed)).toEqual([]);
});
