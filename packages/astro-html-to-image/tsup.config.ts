import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  onSuccess: "pnpm build:types",
  dts: true,
  clean: true,
});
