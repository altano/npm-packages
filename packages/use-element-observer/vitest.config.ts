import { defineProject } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineProject({
  plugins: [react()],
  test: {
    globals: true, // required by testing-library setup
    environment: "jsdom",
    setupFiles: ["./tests/unit/vitest-setup.js"],
    restoreMocks: true,

    dir: "tests/unit",
    coverage: {
      enabled: true,

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
