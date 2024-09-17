import { deriveConfig, type TestingConfig } from "@altano/testing";

const config: TestingConfig = deriveConfig({
  test: {
    testTimeout: 15_000,
    globalSetup: ["./tests/utils/globalSetup.ts"],
  },
});

export default config;
