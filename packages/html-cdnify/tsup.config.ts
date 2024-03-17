import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/*.ts"],
  bundle: false,
  format: "esm",
  onSuccess: "pnpm build:types",
  dts: true,
  clean: true,
});
