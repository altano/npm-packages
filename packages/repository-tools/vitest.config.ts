import { defineProject } from "vitest/config";

export default defineProject({
  // So we can use `using` in ts (https://github.com/vitejs/vite/issues/15464#issuecomment-1872485703)
  esbuild: {
    target: "es2020",
  },
  test: {
    dir: "tests/unit",
    globalSetup: ["./tests/utils/globalSetup.ts"],
    setupFiles: ["@altano/vitest-plugins/matchers"],
    coverage: {
      enabled: true,

      exclude: [
        "tests/e2e",
        "playwright.config.ts",
        ".eslintrc.cjs",
        "tests/unit/**/*.benchmark.tsx",
        "tests/utils/**/*",
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
