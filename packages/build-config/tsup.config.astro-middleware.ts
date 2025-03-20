// TODO Delete this file when deleting older astro integrations

import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    // "src/middleware.ts",
    "src/endpoint-image.ts",
    "src/endpoint-html.ts",
  ],
  format: "esm",
  onSuccess: "pnpm build:types",
  dts: false,
  clean: true,
  platform: "node",
  external: ["astro:middleware", "astro:assets"],
});
