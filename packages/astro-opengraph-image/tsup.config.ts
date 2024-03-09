import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/middleware.ts"],
  format: "esm",
  onSuccess: "pnpm build:types",
  dts: true,
  clean: true,
  external: [
    "astro:middleware",
    "astro:assets",
    "virtual:opengraph-image/user-config",
  ],
});
