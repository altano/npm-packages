import { vitePluginOpengraphImageUserConfig } from "./virtual-user-config.js";
import type { AstroIntegration } from "astro";
import type {
  OpengraphImageConfig,
  OpengraphImageConfigSerializable,
} from "./types.js";

/** The integration */
export default (config: OpengraphImageConfig): AstroIntegration => ({
  name: "astro-opengraph-component",
  hooks: {
    async "astro:config:setup"({ updateConfig, command }): Promise<void> {
      const [imageOptions] = await Promise.all([config.getImageOptions()]);
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
    },
  },
});
