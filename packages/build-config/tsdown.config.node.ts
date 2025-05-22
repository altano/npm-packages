import { defineConfig, type UserConfig, type UserConfigFn } from "tsdown";
import baseConfig from "./tsdown.config.base.js";

const config: UserConfig | UserConfigFn = defineConfig({
  ...baseConfig,
  entry: ["./src/*.ts"],
  platform: "node",
  // node-friendly, unbundled, unminified output
  target: "node22",
  hash: false,
  minify: false,
  sourcemap: false,
  unbundle: true,
});

export default config;
