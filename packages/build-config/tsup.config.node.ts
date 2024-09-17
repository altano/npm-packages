import { defineConfig, type Options } from "tsup";

const config:
  | Options
  | Options[]
  | ((
      overrideOptions: Options,
    ) => Options | Options[] | Promise<Options | Options[]>) = defineConfig({
  entry: ["./src/**/*.ts"],
  format: "esm",
  onSuccess: "pnpm build:types",
  dts: false,
  clean: true,
  platform: "node",
  bundle: false,
  minify: false,
});

export default config;
