import type { UserConfig } from "tsdown";
import baseConfig from "./base.js";

const config: UserConfig = {
  ...baseConfig,
  // since we're bundling, index is the only entry
  entry: ["./src/index.ts"],
  platform: "browser",
  minify: false,
};

export default config;
