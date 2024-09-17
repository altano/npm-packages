import { defineConfig, type ViteUserConfig } from "vitest/config";

const config: ViteUserConfig = defineConfig({
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

export default config;
