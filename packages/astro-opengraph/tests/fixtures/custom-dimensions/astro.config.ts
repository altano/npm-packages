import { defineConfig } from "astro/config";
import { type AstroUserConfig } from "astro";
import openGraph from "../../../src/index.js";
import { getInterPath } from "@altano/assets";

const config: AstroUserConfig = defineConfig({
  integrations: [
    openGraph({
      getImageOptions: async () => ({
        width: 307,
        height: 421,
        fonts: [
          {
            name: "Inter",
            path: getInterPath(400),
            weight: 400,
            style: "normal",
          },
          {
            name: "Inter",
            path: getInterPath(700),
            weight: 800,
            style: "normal",
          },
        ],
      }),
    }),
  ],
});

export default config;
