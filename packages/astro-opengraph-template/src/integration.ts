import type { AstroConfig, AstroIntegration } from "astro";
import { vitePluginOpengraphImageUserConfig } from "./virtual-user-config.js";
import type {
  OpengraphImageConfig,
  OpengraphImageConfigSerializable,
} from "./types.js";
// import { getOpengraphTemplates } from "./getOpengraphTemplates.js";
import { ImageDefaults } from "./config.js";
import path from "node:path";
import url from "node:url";
import fg from "fast-glob";
import { createRequire } from "node:module";

/**
 * The integration
 */
export default (config: OpengraphImageConfig): AstroIntegration => ({
  name: "astro-opengraph-template",
  hooks: {
    // "astro:routes:resolved"({ routes, logger: _logger }) {
    //   console.log(`[astro:routes:resolved]`, { routes });
    // },
    async "astro:config:setup"({
      config: astroConfig,
      command,
      updateConfig,
      injectRoute,
      logger,
    }): Promise<void> {
      console.log(`[astro:config:setup]`);

      const [svgOptions] = await Promise.all([config.getSvgOptions()]);
      const configSerializable: OpengraphImageConfigSerializable = {
        imageFormat: config.imageFormat,
        svgOptions,
      };
      updateConfig({
        vite: {
          // Shove the serializable config into the virtual module for later
          // retrieval in the middleware
          plugins: [vitePluginOpengraphImageUserConfig(configSerializable)],
        },
      });

      const imageFormat = config.imageFormat ?? ImageDefaults.format;

      // TODO Make opengraph-image.png/html filename configurable

      const templatePaths = await getOpengraphTemplatePaths(astroConfig);
      templatePaths.forEach((templatePath) => {
        const routePattern = templatePath.replace(
          "_opengraph.png.astro",
          `opengraph-image.${imageFormat}`,
        );
        // const req = createRequire(import.meta.url);
        // const endpointPath = req.resolve(
        //   "@altano/astro-opengraph-template/endpoint-image",
        // );
        const endpointPath = import.meta.resolve(
          "@altano/astro-opengraph-template/endpoint-image",
        );
        const endpointURL = new URL(endpointPath);
        endpointURL.searchParams.set("face", "1");
        console.log({
          routePattern,
          endpointPath,
          endpointURL: endpointURL.toString(),
        });
        injectRoute({
          pattern: routePattern,
          entrypoint: endpointURL,
        });
        // TODO need to injectRoute a dynamic/ssr version of endpoint-image that
        // doesn't implement getStaticPaths
        // injectRoute({
        //   pattern: routePattern,
        //   entrypoint: "@altano/astro-opengraph-template/endpoint-image",
        //   // TODO is this enough? Will it override the existence of the getstaticpaths fn?
        //   prerender: false,
        // });
        logger.info(`Added "${routePattern}" route`);

        // TODO add this back in
        // if (shouldInjectDevRoute(command)) {
        //   const devRoutePattern = templatePath.replace(
        //     "_opengraph.png.astro",
        //     `opengraph-image.html`,
        //   );
        //   injectRoute({
        //     pattern: devRoutePattern,
        //     entrypoint: "@altano/astro-opengraph-template/endpoint-html",
        //   });
        //   logger.info(`Added "${devRoutePattern}" dev-only route`);
        // }
      });

      // const routePattern = `/[...path]/opengraph-image.${imageFormat}`;
      // injectRoute({
      //   pattern: routePattern,
      //   entrypoint: "@altano/astro-opengraph-template/endpoint-image",
      // });
      // logger.info(`Added "${routePattern}" route`);
      // if (shouldInjectDevRoute(command)) {
      //   const devRoutePattern = "/[...path]/opengraph-image.html";
      //   injectRoute({
      //     pattern: devRoutePattern,
      //     entrypoint: "@altano/astro-opengraph-template/endpoint-html",
      //   });
      //   logger.info(`Added "${devRoutePattern}" dev-only route`);
      // }
    },
  },
});

type AstroConfigSetupHook = NonNullable<
  AstroIntegration["hooks"]["astro:config:setup"]
>;
type Command = Parameters<AstroConfigSetupHook>[0]["command"];

function shouldInjectDevRoute(command: Command): boolean {
  switch (command) {
    case "dev":
      return true;
    case "build":
    case "preview":
      return false;
    case "sync":
      // TODO What the heck is 'sync'?
      return false;
  }
}

async function getOpengraphTemplatePaths(
  astroConfig: AstroConfig,
): Promise<string[]> {
  const srcDirPath = url.fileURLToPath(astroConfig.srcDir);
  const pagesDir = path.join(srcDirPath, "pages");
  const results = await fg("**/_opengraph.png.astro", { cwd: pagesDir });

  if (results.length) {
    console.log(
      `[getOpengraphTemplatePaths, cwd=${pagesDir}] templates found:`,
      results,
    );
  } else {
    console.log(
      `[getOpengraphTemplatePaths, cwd=${pagesDir}] NO templates found`,
    );
  }

  return results;
}
