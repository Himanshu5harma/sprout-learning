import { build } from "esbuild";
import { writeGenerated } from "./write-generated.mjs";
for (const [entry, outfile] of [
  ["src/execution/react-guest.js", "src/generated/react-guest.txt"],
  ["src/preview-runtime.jsx", "src/generated/preview-runtime.js"],
]) {
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    outfile,
    write: false,
    define: { "process.env.NODE_ENV": '"production"' },
  });
  await writeGenerated(outfile, result.outputFiles[0].contents);
}
