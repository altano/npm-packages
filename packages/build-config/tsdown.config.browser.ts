import { defineConfig, type UserConfig, type UserConfigFn } from "tsdown";
import baseConfig from "./tsdown.config.base.js";

const config: UserConfig | UserConfigFn = defineConfig({
  ...baseConfig,
  // since we're bundling, index is the only entry
  entry: ["./src/index.ts"],
  platform: "browser",
  minify: false,
});

export default config;
