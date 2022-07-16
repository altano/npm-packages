import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: "../remark-plugin-test-util/src/setup.ts",
  },
});
