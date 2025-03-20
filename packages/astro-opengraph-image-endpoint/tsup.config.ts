import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/endpoint-image.ts", "src/endpoint-html.ts"],
  format: "esm",
  onSuccess: "pnpm build:types",
  dts: false,
  clean: true,
  platform: "node",
  external: [
    "astro:middleware",
    "astro:assets",
    // TODO move this out, rename to opengraph-image-endpoint?
    "virtual:opengraph-image/user-config",
  ],
});
