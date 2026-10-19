import fs from "node:fs";
import { allLessons, projects } from "../src/curriculum.js";
const jobs = [];
for (const lesson of allLessons.filter(
  (item) => item.category === "JavaScript",
)) {
  jobs.push({
    id: `${lesson.id}/example`,
    code: lesson.code,
    checks: [],
    expectedLines: lesson.teaching.expected.lines,
    expectedPass: true,
  });
  for (const task of [...lesson.teaching.tasks, lesson.teaching.independent])
    jobs.push({
      id: `${lesson.id}/${task.id}/solution`,
      code: task.solution,
      checks: task.checks,
      expectedPass: true,
    });
  for (const task of lesson.teaching.tasks.filter(
    (task) => task.id !== "modify",
  ))
    jobs.push({
      id: `${lesson.id}/${task.id}/mistake`,
      code: task.starter,
      checks: task.checks,
      expectedPass: false,
    });
}
for (const project of projects.filter(
  (project) => project.category === "JavaScript",
))
  jobs.push({
    id: `project/${project.id}`,
    code: project.task.solution,
    checks: project.task.checks,
    expectedPass: true,
  });
const harness = `async (page) => {
  return await page.evaluate(async jobs => {
    const { runJavaScript } = await import('/src/runner.js');
    const results=[];const queue=jobs.slice();
    await Promise.all([0,1,2].map(async()=>{
      while(queue.length){
        const job=queue.shift();const result=await runJavaScript(job.code,{checks:job.checks});
        const observedPass=!result.error&&(job.expectedLines?JSON.stringify(result.lines)===JSON.stringify(job.expectedLines):result.checks.length===job.checks.length&&result.checks.every(check=>check.passed));
        results.push({id:job.id,matched:observedPass===job.expectedPass,expectedPass:job.expectedPass,observedPass,...(!observedPass&&job.expectedPass?{result}:{})});
      }
    }));
    return {total:results.length,matched:results.filter(item=>item.matched).length,failures:results.filter(item=>!item.matched)};
  }, __JOBS__);
}`;
fs.mkdirSync("output/playwright", { recursive: true });
fs.writeFileSync(
  "output/playwright/worker-browser-checks.js",
  harness.replace("__JOBS__", JSON.stringify(jobs)),
);
console.log(`${jobs.length} actual-worker cases prepared.`);
