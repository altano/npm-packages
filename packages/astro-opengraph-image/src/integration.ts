import type { SvgOptions } from "@altano/astro-html-to-image";
import type { AstroConfig, AstroIntegration } from "astro";
import type { DeepPartial } from "astro/dist/type-utils";
import { vitePluginOpengraphImageUserConfig } from "./virtual-user-config";

export type FontWithBuffer = SvgOptions["fonts"][0];
export type FontWithPath = Omit<FontWithBuffer, "data"> & { path: string };

type SvgOptionsBase = {
  width?: number;
  height?: number;
  debug?: boolean;
};
export type SvgOptionsWithFontPaths = SvgOptionsBase & {
  fonts: FontWithPath[];
};
export type SvgOptionsWithFontBuffers = SvgOptionsBase & {
  fonts: FontWithBuffer[];
};

export type OpengraphImageConfig = {
  getSvgOptions(): Promise<SvgOptionsWithFontPaths>;
};

/**
 * This must remain JSON-serializable!
 */
export type OpengraphImageConfigSerializable = {
  svgOptions: SvgOptionsWithFontPaths;
};

export type OpengraphImageConfigSerializableMaybeMocked =
  | OpengraphImageConfigSerializable
  | (() => OpengraphImageConfigSerializable);

export type OpengraphImageConfigResolved = {
  svgOptions: SvgOptionsWithFontBuffers;
};

/**
 * The integration
 */
export default (config: OpengraphImageConfig): AstroIntegration => ({
  name: "astro-opengraph-image",
  hooks: {
    async "astro:config:setup"({ addMiddleware, updateConfig }): Promise<void> {
      const [svgOptions] = await Promise.all([config.getSvgOptions()]);
      const configSerializable: OpengraphImageConfigSerializable = {
        svgOptions,
      };
      const newConfig: DeepPartial<AstroConfig> = {
        vite: {
          // Shove the serializable config into the virtual module for later
          // retrieval in the middleware
          plugins: [vitePluginOpengraphImageUserConfig(configSerializable)],
        },
      };
      updateConfig(newConfig);
      addMiddleware({
        entrypoint: "@altano/astro-opengraph-image/middleware",
        order: "post",
      });
    },
  },
});
