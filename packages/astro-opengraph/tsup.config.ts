import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    // this can only export things that are safe to use from an astro config
    "src/index.ts",
    // this can import/export anything, e.g. `astro:assets`
    "src/endpoint.ts",
    // this can import/export, but be careful: this is loaded in the user's site!
    "src/toolbar/index.tsx",
  ],
  format: "esm",
  onSuccess: "pnpm build:types",
  dts: false,
  clean: true,
  platform: "node",
  external: [
    "astro:middleware",
    "astro:assets",
    "astro/toolbar",
    "virtual:astro-opengraph/user-config",
  ],
});
