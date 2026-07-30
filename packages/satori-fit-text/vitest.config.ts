import { deriveConfig, type ViteUserConfig } from "@altano/testing/vitest";

const config: ViteUserConfig = deriveConfig({
  test: {
    testTimeout: 120_000, // these tests are slow af in github actions
  },
});

export default config;
