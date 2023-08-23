import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/*.ts"],
  splitting: true,
  format: "esm",
  onSuccess: "pnpm build:types",
  dts: true,
  clean: true,
});
