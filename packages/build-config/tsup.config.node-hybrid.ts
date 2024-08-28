import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["./src/**/*.ts"],
    format: "esm",
    outDir: "dist/esm",
    onSuccess: "pnpm build:types:esm",
    clean: true,
    platform: "node",
    bundle: false,
    minify: false,
  },
  {
    entry: ["./src/**/*.ts"],
    format: "cjs",
    outDir: "dist/cjs",
    legacyOutput: true,
    onSuccess: "pnpm build:types:cjs",
    clean: true,
    platform: "node",
    bundle: false,
    minify: false,
  },
]);
