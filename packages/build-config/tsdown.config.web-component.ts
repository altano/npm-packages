import { defineConfig, type UserConfig, type UserConfigFn } from "tsdown";
import browserConfig from "./tsdown.config.browser.js";

const config: UserConfig | UserConfigFn = defineConfig({
  ...browserConfig,
  // since we're bundling, components are the only entries
  entry: ["./src/components/*.ts"],
});

export default config;
