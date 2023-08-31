import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  onSuccess: "pnpm build:types",
  platform: "node",
  target: "node18.17",
  dts: true,
  clean: true,
});
