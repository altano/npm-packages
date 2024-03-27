import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/**/*.ts"],
  format: "esm",
  onSuccess: "pnpm build:types",
  dts: false,
  clean: true,

  platform: "node",
  bundle: false,
  minify: false,
});
