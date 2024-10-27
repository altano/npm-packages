import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    dir: "tests/unit",
    coverage: {
      enabled: true,
      include: ["src"],
      provider: "v8",
      all: true,
      clean: true,
      skipFull: true,
      thresholds: { "100": true },
      reportsDirectory: ".coverage",
    },
  },
});
