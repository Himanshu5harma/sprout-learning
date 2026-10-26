import { readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
const manifest = JSON.parse(await readFile("dist/.vite/manifest.json", "utf8"));
const entry = Object.values(manifest).find(
  (item) => item.isEntry && item.src === "index.html",
);
const overview = Object.values(manifest).find(
  (item) => item.src === "src/pages/OverviewPage.jsx",
);
const files = new Set();
function collect(item) {
  if (!item) return;
  files.add(item.file);
  for (const key of item.imports || []) collect(manifest[key]);
}
collect(entry);
collect(overview);
let initial = 0;
for (const file of files)
  if (file.endsWith(".js"))
    initial += gzipSync(await readFile("dist/" + file)).length;
let css = 0;
for (const file of entry.css || [])
  css += gzipSync(await readFile("dist/" + file)).length;
const budgets = {
  initialJavaScriptGzip: { bytes: initial, limit: 160000 },
  initialCssGzip: { bytes: css, limit: 40000 },
};
console.log(
  JSON.stringify(
    {
      baselineInitialJavaScriptGzip: 323650,
      measured: budgets,
      initialJsReductionPercent: Math.round((1 - initial / 323650) * 100),
    },
    null,
    2,
  ),
);
if (Object.values(budgets).some((item) => item.bytes > item.limit))
  throw new Error(
    "Performance budget exceeded. Inspect the build graph before changing the budget.",
  );
