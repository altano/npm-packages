import type { UserConfig } from "tsdown";
import browserConfig from "./browser.js";

const config: UserConfig = {
  ...browserConfig,
  // since we're bundling, components are the only entries
  entry: ["./src/components/*.ts"],
};

export default config;
