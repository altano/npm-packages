import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import remarkAstrojsImage from "@altano/remark-astrojs-image";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://test.example.org",
  integrations: [
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    react(),
    mdx({
      remarkPlugins: [remarkAstrojsImage],
    }),
  ],
  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: "dracula",
      // theme: shiki.loadTheme("xtree-gold"),
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // Enable word wrap to prevent horizontal scrolling
      wrap: true,
    },
  },
});
