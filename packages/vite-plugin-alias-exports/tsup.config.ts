import { defineConfig } from "tsup";

export default defineConfig({
  outDir: "dist",
  entry: ["src/index.ts"],
  bundle: false,
  format: "esm",
  onSuccess: "pnpm build:types",
  dts: true,
  clean: true,
});
