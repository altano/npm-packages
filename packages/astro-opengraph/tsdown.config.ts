import { defineConfig, type UserConfig, type UserConfigFn } from "tsdown";

const config: UserConfig | UserConfigFn = defineConfig({
  entry: [
    // this can only export things that are safe to use from an astro config
    "src/index.ts",
    // this can import/export anything, e.g. `astro:assets`
    "src/endpoint.ts",
  ],
  dts: true,
  clean: true,
  platform: "node",
  external: [
    "astro:middleware",
    "astro:assets",
    "virtual:astro-opengraph/user-config",
  ],
});

export default config;
