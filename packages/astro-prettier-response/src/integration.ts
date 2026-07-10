import { runtimeLogger } from "@inox-tools/runtime-logger";
import { ConfigSchema } from "./config.js";
import type { AstroIntegration } from "astro";

const VIRTUAL_MODULE_ID = "virtual:astro-prettier-response/config";
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;

/**
 * A minimal Vite plugin that serves the resolved integration config as a
 * virtual module. Replaces `addVirtualImports` from the (deprecated)
 * astro-integration-kit. Typed structurally (rather than importing Vite's
 * `Plugin`) so this production module doesn't depend on the `vite` dev
 * dependency.
 */
export function virtualConfigPlugin(moduleContents: string): {
  name: string;
  resolveId(id: string): string | undefined;
  load(id: string): string | undefined;
} {
  return {
    name: "astro-prettier-response-virtual-config",
    resolveId(id) {
      return id === VIRTUAL_MODULE_ID ? RESOLVED_VIRTUAL_MODULE_ID : undefined;
    },
    load(id) {
      return id === RESOLVED_VIRTUAL_MODULE_ID ? moduleContents : undefined;
    },
  };
}

const integration: (options?: {
  disableMinifiers?: boolean | undefined;
  formatXml?: boolean | undefined;
}) => AstroIntegration & {} = (options) => {
  const resolvedOptions = ConfigSchema.parse(options);

  return {
    name: "astro-prettier-response",
    hooks: {
      "astro:config:setup": (params) => {
        const { config, updateConfig, addMiddleware, logger } = params;

        updateConfig({
          vite: {
            plugins: [
              virtualConfigPlugin(
                `export default ${JSON.stringify(resolvedOptions)}`,
              ),
            ],
          },
        });

        runtimeLogger(params, { name: "astro-prettier-response" });

        if (resolvedOptions.disableMinifiers) {
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

          // Astro 6 hardcodes minify: true for the client environment,
          // ignoring vite.build.minify. Use a plugin to override it.
          if (config?.vite?.environments?.["client"]?.build?.minify !== false) {
            didConfigOverride = true;
            updateConfig({
              vite: {
                plugins: [
                  {
                    name: "astro-prettier-response-disable-client-minify",
                    config() {
                      return {
                        environments: {
                          client: {
                            build: {
                              minify: false,
                            },
                          },
                        },
                      };
                    },
                  },
                ],
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
          entrypoint: new URL("./middleware/index.js", import.meta.url),
          order: "post",
        });
      },
    },
  };
};

export default integration;
