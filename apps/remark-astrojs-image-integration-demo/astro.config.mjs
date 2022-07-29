import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import remarkAstrojsImage from "@altano/remark-astrojs-image";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [
    image(),
    mdx({
      remarkPlugins: {
        extends: [remarkAstrojsImage],
        // extends: [
        //   [
        //     remarkAstrojsImageUseComponent,
        //     {
        //       convertMarkdownImages: true,
        //       convertJsxImages: true,
        //       convertJsxPictures: true,
        //     },
        //   ],
        //   [
        //     remarkAstrojsImageAutoImport,
        //     {
        //       ignoreFileNotFound: false,
        //       ignoreNonFileUrl: true,
        //     },
        //   ],
        // ],
      },
    }),
  ],
});
