import { deriveConfig, type ViteUserConfig } from "@altano/testing/vitest";

const config: ViteUserConfig = deriveConfig({
  test: {
    testTimeout: 15_000,
    globalSetup: ["./tests/utils/globalSetup.ts"],
  },
});

export default config;
