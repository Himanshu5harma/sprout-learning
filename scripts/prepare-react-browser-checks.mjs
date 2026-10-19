import fs from "node:fs";
import { transform } from "@babel/standalone";
import { allLessons, projects } from "../src/curriculum.js";
import { loopGuard } from "../src/learning/compile-react.js";

const fixtures = [];
function add(id, code, checks, expectedPass = true) {
  fixtures.push({
    id,
    code: transform(code, {
      presets: [["react", { runtime: "classic" }]],
      plugins: [loopGuard, "transform-modules-commonjs"],
    }).code,
    checks,
    expectedPass,
  });
}
for (const lesson of allLessons.filter(
  (lesson) => lesson.category === "React",
)) {
  add(`${lesson.id}/example`, lesson.code, lesson.teaching.exampleChecks);
  for (const task of [...lesson.teaching.tasks, lesson.teaching.independent])
    add(`${lesson.id}/${task.id}/solution`, task.solution, task.checks);
}
for (const project of projects.filter(
  (project) => project.category === "React",
))
  add(`project/${project.id}`, project.task.solution, project.task.checks);
for (const lesson of allLessons.filter(
  (lesson) => lesson.category === "React",
)) {
  for (const task of lesson.teaching.tasks.filter(
    (task) => task.id !== "modify",
  ))
    add(`${lesson.id}/${task.id}/mistake`, task.starter, task.checks, false);
}
const harness = `async (page) => {
  const fixtures = __FIXTURES__;
  return await page.evaluate(async fixtures => {
    const results = [];
    async function run(fixture) {
      return new Promise(resolve => {
        const frame = document.createElement('iframe');
        frame.setAttribute('sandbox','allow-scripts allow-forms');
        frame.style.cssText='position:fixed;left:-9000px;top:0;width:740px;height:640px;border:0';
        const id = crypto.randomUUID();
        let ended = false;
        function finish(result) {
          if (ended) return; ended = true; clearTimeout(timer); window.removeEventListener('message',receive); frame.remove();
          const observedPass = !result.error && result.checks?.length === fixture.checks.length && result.checks.every(check=>check.passed);
          results.push({id:fixture.id,expectedPass:fixture.expectedPass,observedPass,matched:observedPass === fixture.expectedPass,...result}); resolve();
        }
        function receive(event) {
          if(event.source!==frame.contentWindow)return;
          if(event.data?.type==='sprout-preview-ready') frame.contentWindow.postMessage({type:'sprout-render',runId:id,code:fixture.code,checks:fixture.checks},'*');
          if(event.data?.runId!==id)return;
          if(event.data.type==='sprout-preview-error')finish({error:event.data.message});
          if(event.data.type==='sprout-preview-complete')finish({checks:event.data.checks});
        }
        const timer = setTimeout(()=>finish({error:'QA preview timeout'}),9000);
        window.addEventListener('message',receive);
        frame.srcdoc='<html><body><div id="app"></div><script src="'+location.origin+'/preview-runtime.js"></script></body></html>';
        document.body.append(frame);
      });
    }
    const focusCases = fixtures.filter(fixture => fixture.checks.some(check => check.steps.some(step => step.action === 'focused')));
    const queue = fixtures.filter(fixture => !focusCases.includes(fixture));
    await Promise.all([0,1,2].map(async()=>{while(queue.length)await run(queue.shift());}));
    for (const fixture of focusCases) await run(fixture);
    return {total:results.length,matched:results.filter(result=>result.matched).length,failures:results.filter(result=>!result.matched),ids:results.map(result=>result.id)};
  }, fixtures);
}`;
fs.mkdirSync("output/playwright", { recursive: true });
for (let start = 0; start < fixtures.length; start += 20) {
  const batch = fixtures.slice(start, start + 20);
  fs.writeFileSync(
    `output/playwright/react-checks-${Math.floor(start / 20) + 1}.js`,
    harness.replace("__FIXTURES__", JSON.stringify(batch)),
  );
}
fs.writeFileSync(
  "output/playwright/react-check-manifest.json",
  JSON.stringify(
    {
      count: fixtures.length,
      batches: Math.ceil(fixtures.length / 20),
      examples: 24,
      positiveSolutions: 96,
      projects: 5,
      intentionalMistakes: 48,
    },
    null,
    2,
  ),
);
console.log(
  `${fixtures.length} rendered cases prepared in ${Math.ceil(fixtures.length / 20)} batches.`,
);
