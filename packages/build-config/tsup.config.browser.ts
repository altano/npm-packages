import { defineConfig } from "tsup";

export default defineConfig({
  // since we're bundling, index is the only entry
  entry: ["./src/index.ts"],
  format: "esm",
  onSuccess: "pnpm build:types",
  dts: false,
  clean: true,

  platform: "browser",
  bundle: true,
});
