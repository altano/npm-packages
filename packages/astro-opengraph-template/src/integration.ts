import { vitePluginOpengraphImageUserConfig } from "./virtual-user-config.js";
import type { AstroIntegration } from "astro";
import type {
  OpengraphImageConfig,
  OpengraphImageConfigSerializable,
} from "./types.js";

/** The integration */
export default (config: OpengraphImageConfig): AstroIntegration => ({
  name: "astro-opengraph-template",
  hooks: {
    async "astro:config:setup"({ updateConfig, command }): Promise<void> {
      const [svgOptions] = await Promise.all([config.getSvgOptions()]);
      const configSerializable: OpengraphImageConfigSerializable = {
        imageFormat: config.imageFormat,
        svgOptions,
        command,
      };
      updateConfig({
        vite: {
          // Shove the serializable config into the virtual module for later
          // retrieval in the middleware
          plugins: [vitePluginOpengraphImageUserConfig(configSerializable)],
        },
      });
    },
  },
});
