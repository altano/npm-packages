import { defineConfig, type UserConfig, type UserConfigFn } from "tsdown";
import baseConfig from "../build-config/tsdown.config.base.js";

const config: UserConfig | UserConfigFn = defineConfig({
  ...baseConfig,
  entry: [
    // this can only export things that are safe to use from an astro config
    "src/index.ts",
    // this can import/export anything, including modules used during astro build, e.g. `astro:assets`
    "src/endpoint.ts",
    // this can import/export anything, including modules used during astro build, e.g. `astro:assets`
    "src/config.ts",
    // this can import/export, but be careful: this is loaded in the user's site!
    "src/toolbar/index.tsx",
  ],
  platform: "node",
  external: [
    "astro:middleware",
    "astro:assets",
    "astro/toolbar",
    "virtual:astro-opengraph/user-config",
    // this is optionally in the consuming astro site. we shouldn't bundle it.
    "@vitejs/plugin-react",
  ],
});

export default config;
