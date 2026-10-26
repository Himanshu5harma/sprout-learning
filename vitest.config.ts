import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    setupFiles: ["./tests/unit/setup.ts"],
    restoreMocks: true,
    coverage: {
      include: [
        "src/persistence/**",
        "src/domain/**",
        "src/features/progress/evidence.ts",
        "src/execution/protocol.ts",
      ],
    },
  },
});
