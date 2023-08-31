import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      skipFull: true,
      "100": true,
      reportsDirectory: ".coverage",
    },
  },
});
