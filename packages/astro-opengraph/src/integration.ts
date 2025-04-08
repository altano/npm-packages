import type { AstroIntegration } from "astro";
import type {
  OpengraphImageConfig,
  OpengraphImageConfigSerializable,
} from "./types.js";
import { vitePluginOpengraphImageUserConfig } from "./virtual-user-config.js";

export default (config: OpengraphImageConfig): AstroIntegration => ({
  name: "@altano/astro-opengraph",
  hooks: {
    async "astro:config:setup"({
      updateConfig,
      command,
      addDevToolbarApp,
    }): Promise<void> {
      const imageOptions = await config.getImageOptions();
      const configSerializable: OpengraphImageConfigSerializable = {
        imageOptions,
        command,
      };
      updateConfig({
        vite: {
          // Shove the serializable config into the virtual module for later
          // retrieval in the middleware
          plugins: [vitePluginOpengraphImageUserConfig(configSerializable)],
        },
      });
      addDevToolbarApp({
        id: "@altano/astro-opengraph",
        name: "Open Graph",
        // icon: "🌠",
        icon: "image",
        // We don't use `@altano/astro-opengraph/toolbar` because that won't
        // resolve when serving the test fixture for e2e runs (`pnpm
        // test:e2e:server`)
        entrypoint: new URL("./toolbar/index.js", import.meta.url),
      });
    },
  },
});
