import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "packages/*/vitest.config.ts",
  {
    extends: "./vitest.config.ts",
    test: {
      include: ["**/tests/unit/**/*.spec.{ts,js}"],
    },
  },
  {
    extends: "./vitest.config.ts",
    test: {
      include: ["**/tests/unit/**/*.browser.spec.{ts,tsx,js,jsx}"],
      environment: "jsdom",
      setupFiles: ["@testing-library/jest-dom/vitest"],
    },
  },
]);
