import { build } from "esbuild";
await build({
  entryPoints: ["src/preview-runtime.jsx"],
  bundle: true,
  minify: true,
  outfile: "public/preview-runtime.js",
  define: { "process.env.NODE_ENV": '"production"' },
});
