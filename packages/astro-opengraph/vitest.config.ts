import { deriveConfig, type TestingConfig } from "@altano/testing";

const config: TestingConfig = deriveConfig({
  test: {
    root: ".",
    coverage: {
      // toolbar is entirely e2e tested
      exclude: [
        "src/toolbar",
        "**/tests/**",
        "**/dist/**",
        "**/tests/fixtures/**",
        "**/vitest-plugins/**",
        "**/scripts/**",
        "**/astro-opengraph/*.ts",
      ],
      allowExternal: true,
      skipFull: false,
    },
    setupFiles: ["./tests/unit/utils/setup.ts"],
    hookTimeout: 120_000, // building the astro test fixtures might take a while in ci
    testTimeout: 20_000,
  },
});

export default config;
