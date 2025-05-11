import { defineConfig, type UserConfig, type UserConfigFn } from "tsdown";

const config: UserConfig | UserConfigFn = defineConfig({
  // since we're bundling, index is the only entry
  entry: ["./src/index.ts"],
  dts: true,
  clean: true,
  platform: "browser",
  minify: false,
  // bundle: true, // tsdown _only_ supports bundling atm
});

export default config;
