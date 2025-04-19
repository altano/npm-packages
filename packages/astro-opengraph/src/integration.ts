import type { AstroIntegration } from "astro";
import type {
  OpengraphImageConfig,
  OpengraphImageConfigSerializable,
} from "./types.js";
import { vitePluginOpengraphImageUserConfig } from "./virtual-user-config.js";

export default (config: OpengraphImageConfig): AstroIntegration => ({
  name: "@altano/astro-opengraph",
  hooks: {
    async "astro:config:setup"({ updateConfig, command }): Promise<void> {
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
    },
  },
});
