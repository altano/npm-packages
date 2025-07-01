import {
  deriveConfigWithoutPlugins,
  type TestingConfig,
} from "@altano/testing";

const config: TestingConfig = deriveConfigWithoutPlugins({
  test: {
    setupFiles: ["./tests/unit/utils/setup.ts"],
    hookTimeout: 120_000, // building the astro test fixtures might take a while in ci
    testTimeout: 20_000,
  },
});

export default config;
