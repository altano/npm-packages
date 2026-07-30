import { defineConfig, type UserConfig, type UserConfigFn } from "tsdown";
import nodeConfig from "../build-config/tsdown.config.node.js";

const config: UserConfig | UserConfigFn = defineConfig({
  ...nodeConfig,
  // `src` is grouped by test runner (src/vitest, src/playwright), so entry
  // points sit one level deeper than the shared node config looks.
  entry: ["./src/*/*.ts"],
});

export default config;
