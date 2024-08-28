import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    dir: "tests/unit",

    coverage: {
      enabled: true,

      exclude: [
        "tests/e2e",
        "playwright.config.ts",
        ".eslintrc.cjs",
        "tests/unit/**/*.benchmark.{ts,tsx}",
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
