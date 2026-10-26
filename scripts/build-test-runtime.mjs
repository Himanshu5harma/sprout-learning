import { build } from "esbuild";
await build({
  entryPoints: ["src/execution/vm.ts"],
  outfile: "output/test-vm.mjs",
  bundle: true,
  format: "esm",
  platform: "node",
});
