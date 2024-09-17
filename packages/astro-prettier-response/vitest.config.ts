import {
  deriveConfigWithoutPlugins,
  type TestingConfig,
} from "@altano/testing";

const config: TestingConfig = deriveConfigWithoutPlugins({
  test: {
    setupFiles: ["./tests/unit/utils/setup.ts"],
  },
});

export default config;
