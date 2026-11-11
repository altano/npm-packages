// astro.config.mjs
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import astrobook from "astrobook";
import remarkSectionize from "remark-sectionize";
import type { AstroUserConfig } from "astro";

// https://astro.build/config
const config: AstroUserConfig = defineConfig({
  integrations: [astrobook()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkSectionize],
    }),
  },
});

export default config;
