// astro.config.mjs
import { defineConfig } from "astro/config";
import astrobook from "astrobook";
import remarkSectionize from "remark-sectionize";
import type { AstroUserConfig } from "astro";

// https://astro.build/config
const config: AstroUserConfig = defineConfig({
  integrations: [astrobook()],
  markdown: {
    remarkPlugins: [remarkSectionize],
  },
});

export default config;
