import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,

      include: ["**/src/**/*.{ts,tsx}"],
      exclude: [
        "tests/e2e",
        "playwright.config.ts",
        ".eslintrc.cjs",
        "tests/unit/**/*.benchmark.tsx",
      ],

      provider: "v8",
      all: true,
      clean: true,
      skipFull: true,
      thresholds: { "100": true },
      reportsDirectory: ".coverage",
    },
  },
});
