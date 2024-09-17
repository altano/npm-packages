import { defineConfig, type Options } from "tsup";

const config:
  | Options
  | Options[]
  | ((
      overrideOptions: Options,
    ) => Options | Options[] | Promise<Options | Options[]>) = defineConfig({
  // since we're bundling, index is the only entry
  entry: ["./src/index.ts"],
  format: "esm",

  // Because we're bundling, tsc can't generate types for us, so we use tsup's
  // type gen. The downside is that we don't get declaration maps. Unfortunately
  // we can't use tsc to ONLY generate declaration maps (and they would be wrong
  // because it doesn't work on the bundled file anyway).
  dts: true,

  clean: true,

  platform: "browser",
  bundle: true,
});

export default config;
