import { build } from "vite";
import "./build-catalog.mjs";
import "./build-preview.mjs";
await build({
  build: {
    outDir: "output/browser-app",
    rolldownOptions: {
      input: { app: "index.html", harness: "tests/browser/harness.html" },
    },
  },
});
