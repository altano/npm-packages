import {
  defineProject,
  mergeConfig,
  type UserProjectConfigExport,
} from "vitest/config";
import configShared from "../vitest.shared.js";

const sharedConfig: UserProjectConfigExport = {
  test: {
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
};

export default mergeConfig(
  sharedConfig,
  defineProject({
    test: {
      environment: "jsdom",
    },
  }),
);
