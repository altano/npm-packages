import { deriveConfig, type TestingConfig } from "@altano/testing";

const config: TestingConfig = deriveConfig({
  test: {
    coverage: {
      // TODO figure out how to enable coverage for code only exercised in astro
      // build. See https://github.com/Fryuni/inox-tools/issues/214 for
      // discussion.
      enabled: false,
    },
    setupFiles: ["./tests/unit/utils/setup.ts"],
    hookTimeout: 120_000, // building the astro test fixtures might take a while in ci
    testTimeout: 20_000,
  },
});

export default config;
