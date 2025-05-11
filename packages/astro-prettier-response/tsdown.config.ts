import { defineConfig, type UserConfig, type UserConfigFn } from "tsdown";

const config: UserConfig | UserConfigFn = defineConfig({
  entry: [
    // this can only export things that are safe to use from an astro config
    "src/index.ts",
    // this can import/export anything, including modules used during astro build, e.g. `astro:assets`
    "src/middleware/index.ts",
  ],
  dts: true,
  clean: true,
  platform: "node",
  external: [
    // Astro's virtual modules
    "astro:middleware",
    "astro:assets",
    // this integration's virtual modules
    "@it-astro:logger:astro-prettier-response",
    "virtual:astro-prettier-response/config",
    // this is optionally in the consuming astro site. we shouldn't bundle it.
    "@vitejs/plugin-react",
  ],
});

export default config;
