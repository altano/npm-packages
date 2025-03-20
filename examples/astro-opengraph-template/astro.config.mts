import { defineConfig } from "astro/config";
import opengraphImage from "@altano/astro-opengraph-template";

import metaTags from "astro-meta-tags";

// https://astro.build/config
export default defineConfig({
  integrations: [
    opengraphImage({
      // eslint-disable-next-line @typescript-eslint/require-await
      async getSvgOptions() {
        return {
          fonts: [
            {
              name: "Inter",
              path: "node_modules/@fontsource/inter/files/inter-latin-400-normal.woff",
              weight: 400,
              style: "normal",
            },
            {
              name: "Inter",
              path: "node_modules/@fontsource/inter/files/inter-latin-800-normal.woff",
              weight: 800,
              style: "normal",
            },
          ],
        };
      },
    }),
    metaTags(),
  ],
});
