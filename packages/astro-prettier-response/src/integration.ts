import { runtimeLogger } from "@inox-tools/runtime-logger";
import {
  addVirtualImports,
  createResolver,
  defineIntegration,
} from "astro-integration-kit";
import { ConfigSchema } from "./config.js";
import type { AstroIntegration } from "astro";

const integration: (options?: {
  disableMinifiers?: boolean | undefined;
  formatXml?: boolean | undefined;
}) => AstroIntegration & {} = defineIntegration({
  name: "astro-prettier-response",
  optionsSchema: ConfigSchema,
  setup({ options, name }) {
    const { resolve } = createResolver(import.meta.url);

    return {
      hooks: {
        "astro:config:setup": (params) => {
          addVirtualImports(params, {
            name,
            imports: {
              "virtual:astro-prettier-response/config": `export default ${JSON.stringify(ConfigSchema.parse(options))}`,
            },
          });

          runtimeLogger(params, { name: "astro-prettier-response" });

          const { config, updateConfig, addMiddleware, logger } = params;

          if (options.disableMinifiers) {
            let didConfigOverride = false;

            if (config.compressHTML !== false) {
              didConfigOverride = true;
              updateConfig({
                compressHTML: false,
              });
            }

            if (config?.vite?.build?.minify !== false) {
              didConfigOverride = true;
              updateConfig({
                vite: {
                  build: {
                    minify: false,
                  },
                },
              });
            }

            if (config?.vite?.build?.cssMinify !== false) {
              didConfigOverride = true;
              updateConfig({
                vite: {
                  build: {
                    cssMinify: false,
                  },
                },
              });
            }

            if (didConfigOverride) {
              logger.info(
                `Disabling minification of html/css/js in Astro config (https://github.com/altano/npm-packages/tree/main/packages/astro-prettier-response#config-overrides)`,
              );
            }
          }

          addMiddleware({
            entrypoint: resolve("./middleware/index.js"),
            order: "post",
          });
        },
      },
    };
  },
});

export default integration;
