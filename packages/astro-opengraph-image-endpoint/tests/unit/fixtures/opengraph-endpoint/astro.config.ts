import { defineConfig } from "astro/config";
import { type AstroUserConfig } from "astro";
import astroOpengraphImageEndpoint from "../../../../src/index.js";
import { getSvgDefaultOptions } from "../../utils/defaults.js";

const config: AstroUserConfig = defineConfig({
  integrations: [
    astroOpengraphImageEndpoint({
      getSvgOptions: getSvgDefaultOptions,
    }),
  ],
});

export default config;
