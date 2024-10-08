import { defineProject } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineProject({
  plugins: [react()],
  test: {
    globals: true, // required by testing-library setup
    environment: "jsdom",
    setupFiles: ["@testing-library/jest-dom/vitest"],
    restoreMocks: true,

    dir: "tests/unit",
    coverage: {
      enabled: true,

      exclude: [
        "tests/e2e",
        "playwright.config.ts",
        ".eslintrc.cjs",
        ".tsup",
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
