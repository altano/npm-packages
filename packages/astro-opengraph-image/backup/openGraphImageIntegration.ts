import kleur from "kleur";
import urlJoin from "url-join";
import { SatoriOptions } from "@altano/astro-html-to-image";
import plugin from "./vite-plugin";

import type { AstroConfig, AstroIntegration, RouteData } from "astro";

export function openGraphImageIntegration(): AstroIntegration {
  let astroConfig: AstroConfig;

  const integration: AstroIntegration = {
    name: "astro-routes-api",
    hooks: {
      // "astro:config:setup": ({ injectRoute, config, command }) => {
      //   console.log("in integration");
      //   injectRoute({
      //     pattern: "/api/get-opengraph-image",
      //     entryPoint: "@altano/astro-opengraph-image/dist/endpoint.js",
      //   });
      // },

      // --------------------------------------

      // "astro:config:done": ({ config }) => {
      //   astroConfig = config;
      // },

      // "astro:build:done": async ({ routes }) => {
      //   const isSSR = astroConfig.output === "server";

      //   if (!astroConfig?.site) {
      //     console.error(
      //       kleur.bgRed("[astro-satori]: error! site is required."),
      //     );
      //     return;
      //   }

      //   const site = urlJoin(astroConfig.site, astroConfig?.base ?? "/");

      //   if (!isSSR) {
      //     try {
      //       await Promise.all(
      //         routes.map((r) =>
      //           genOgAndReplace(
      //             r,
      //             site,
      //             // satoriElement,
      //             // satoriOptionsFactory
      //           ),
      //         ),
      //       );

      //       console.log(kleur.bgGreen("open graph images generated"));
      //     } catch (e: unknown) {
      //       console.error(kleur.bgRed("failed to generate open graph images"));
      //     }
      //   }
      // },

      // --------------------------------------

      "astro:config:setup": ({ updateConfig }) => {
        console.log(`astro:config:setup`);
        updateConfig({
          vite: {
            plugins: [
              plugin({
                include: "*.html",
              }),
            ],
          },
        });
      },
    },
  };

  return integration;
}

// const genOgAndReplace = async (
//   route: RouteData,
//   site: string,
//   // element?: React.ReactNode,
//   // optionsFactory?: () => Promise<SatoriOptions>
// ) => {
//   const { distURL: url, component } = route;
//   if (!url) {
//     return;
//   }

//   console.log({ route });
// };
