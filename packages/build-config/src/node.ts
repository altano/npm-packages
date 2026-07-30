import type { UserConfig } from "tsdown";
import baseConfig from "./base.js";

const config: UserConfig = {
  ...baseConfig,
  entry: ["./src/*.ts"],
  platform: "node",
  // node-friendly, unbundled, unminified output
  target: "node22",
  hash: false,
  minify: false,
  sourcemap: false,
  unbundle: true,
};

export default config;
