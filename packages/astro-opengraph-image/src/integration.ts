import type { AstroIntegration } from "astro";

const name = `@altano/astro-opengraph-image`;

export function createPlugin(): AstroIntegration {
  return {
    name,
    hooks: {
      "astro:config:setup"({ config: _config }): void {
        // if (!config.build.excludeMiddleware) {
        //   throw new Error(
        //     `You must set build.excludeMiddleware = true in your Astro config for the ${name} integration to work.`,
        //   );
        // }
      },
    },
  };
}
