import { test, expect } from "@playwright/test";
import {
  allLessons as rawLessons,
  projects as rawProjects,
} from "../../src/curriculum.js";
import { z } from "zod";
import {
  lessonContentSchema,
  projectSchema,
} from "../../src/domain/curriculum";
const allLessons = z.array(lessonContentSchema).parse(rawLessons);
const projects = z.array(projectSchema).parse(rawProjects);
import type { Fixture } from "./harness";
for (const language of ["JavaScript", "React"] as const)
  test(`${language} curriculum examples, solutions, and intentional mistakes work in the production runner`, async ({
    page,
  }) => {
    test.setTimeout(300000);
    await page.goto("/tests/browser/harness.html");
    await page.waitForFunction(() => typeof window.runFixture === "function");
    const fixtures: Fixture[] = [];
    for (const lesson of allLessons.filter(
      (lesson) => lesson.category === language,
    )) {
      fixtures.push({
        id: `${lesson.id}/example`,
        code: lesson.code,
        checks: language === "React" ? lesson.teaching.exampleChecks || [] : [],
        expectedPass: true,
        ...(language === "JavaScript"
          ? { expectedLines: lesson.teaching.expected.lines || [] }
          : {}),
      });
      for (const task of [
        ...lesson.teaching.tasks,
        lesson.teaching.independent,
      ])
        fixtures.push({
          id: `${lesson.id}/${task.id}/solution`,
          code: task.solution,
          checks: task.checks,
          expectedPass: true,
        });
      for (const task of lesson.teaching.tasks.filter(
        (task) => task.id !== "modify",
      ))
        fixtures.push({
          id: `${lesson.id}/${task.id}/mistake`,
          code: task.starter,
          checks: task.checks,
          expectedPass: false,
        });
    }
    for (const project of projects.filter(
      (project) => project.category === language,
    ))
      fixtures.push({
        id: `project/${project.id}`,
        code: project.task.solution,
        checks: project.task.checks,
        expectedPass: true,
      });
    const failures = [];
    for (const fixture of fixtures) {
      const result = await page.evaluate(
        ({ fixture, language }) => window.runFixture(fixture, language),
        { fixture, language },
      );
      const passed =
        !result.error &&
        (fixture.expectedLines
          ? JSON.stringify(result.lines) ===
            JSON.stringify(fixture.expectedLines)
          : result.checks.length === fixture.checks.length &&
            result.checks.every((check) => check.passed));
      if (passed !== fixture.expectedPass)
        failures.push({ id: fixture.id, result });
    }
    console.log(
      `${language}: ${fixtures.length} actual execution cases; ${failures.length} mismatches`,
    );
    expect(failures).toEqual([]);
  });
