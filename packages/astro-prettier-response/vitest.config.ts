import {
  deriveConfigWithoutPlugins,
  type ViteUserConfig,
} from "@altano/testing/vitest";

const config: ViteUserConfig = deriveConfigWithoutPlugins({
  test: {
    setupFiles: ["./tests/unit/utils/setup.ts"],
    hookTimeout: 120_000, // building the astro test fixtures might take a while in ci
    testTimeout: 20_000,
  },
});

export default config;
