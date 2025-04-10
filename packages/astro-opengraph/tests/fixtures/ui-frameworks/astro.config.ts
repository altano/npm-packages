import { defineConfig } from "astro/config";
import { type AstroUserConfig } from "astro";
import openGraph from "../../../src/index.ts";
import { getInterPath } from "@altano/assets";
import preact from "@astrojs/preact";
import svelte from "@astrojs/svelte";
import vue from "@astrojs/vue";

const config: AstroUserConfig = defineConfig({
  integrations: [
    // Make sure we play nice with ui frameworks ...
    svelte(),
    vue(),
    // ... most importantly, preact, which is used to render the toolbar. When I
    // tried using react to render the toolbar, it worked fine unless the
    // `@astrojs/react` integration was also added, and then I'd get runtime
    // errors when rendering the toolbar. Preact doesn't seem to have this
    // issue, but let's explicitly test that remains the case by including it in
    // this fixture.
    preact(),
    // install this integration
    openGraph({
      getImageOptions: async () => ({
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
