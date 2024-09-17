import { defineConfig, type Options } from "tsup";

const config:
  | Options
  | Options[]
  | ((
      overrideOptions: Options,
    ) => Options | Options[] | Promise<Options | Options[]>) = defineConfig({
  entry: [
    // this can only export things that are safe to use from an astro config
    "src/index.ts",
    // this can import/export anything, including modules used during astro build, e.g. `astro:assets`
    "src/middleware/index.ts",
  ],
  format: "esm",
  onSuccess: "pnpm build:types",
  dts: false,
  clean: true,
  platform: "node",
  external: [
    "astro:middleware",
    "astro:assets",
    // virtual modules
    "@it-astro:logger:astro-prettier-response",
    "virtual:astro-prettier-response/config",
    // this is optionally in the consuming astro site. we shouldn't bundle it.
    "@vitejs/plugin-react",
  ],
});

export default config;
