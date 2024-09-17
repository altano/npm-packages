import { deriveConfig, type TestingConfig } from "@altano/testing";

const config: TestingConfig = deriveConfig({
  test: {
    testTimeout: 120_000, // these tests are slow af in github actions
  },
});

export default config;
