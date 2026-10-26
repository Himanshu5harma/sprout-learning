import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/browser",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  expect: { timeout: 12000 },
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true,
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run test:serve",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
  reporter: [
    ["list"],
    ["html", { outputFolder: "output/playwright-report", open: "never" }],
  ],
  outputDir: "output/playwright-results",
});
