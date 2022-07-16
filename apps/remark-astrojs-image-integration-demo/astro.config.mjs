import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import image from "@astrojs/image";
import AutoImport from "astro-auto-import";
import remarkAstrojsImageAutoImport from "@altano/remark-astrojs-image-auto-import/dist/index.js";
import remarkAstrojsImageUseComponent from "@altano/remark-astrojs-image-use-component/dist/index.js";

// console.log(image().hooks["astro:config:setup"].toString());

// https://astro.build/config
export default defineConfig({
  integrations: [
    AutoImport({
      imports: [
        {
          "@astrojs/image/components": ["Image", "Picture"],
        },
      ],
    }),
    react(),
    image(),
  ],
  markdown: {
    remarkPlugins: [
      [remarkAstrojsImageUseComponent, {}],
      [remarkAstrojsImageAutoImport, {}],
    ],
  },
});
