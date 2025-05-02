import { defineConfig } from "astro/config";
import { type AstroUserConfig } from "astro";
import prettierResponse from "../../../src/index.ts";

const config: AstroUserConfig = defineConfig({
  integrations: [
    // Configuration of the integration happens in the tests to make code
    // coverage work
    prettierResponse(),
  ],
  vite: {
    build: {
      minify: false,
      cssMinify: false,
    },
  },
  compressHTML: false,
});

export default config;
