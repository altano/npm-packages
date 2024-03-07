import type { SvgOptions, ImageFormat } from "@altano/astro-html-to-image";
import type { AstroIntegration } from "astro";
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
  /**
   * An image format to use for the output image. Defaults to "png"
   */
  imageFormat?: ImageFormat;
  /**
   * Options to use for the svg file that is generated. Most importantly, fonts
   * must be provided.
   */
  getSvgOptions(): Promise<Partial<SvgOptionsWithFontPaths>>;
};

/**
 * This must remain JSON-serializable!
 */
export type OpengraphImageConfigSerializable = {
  imageFormat: ImageFormat;
  svgOptions: SvgOptionsWithFontPaths;
};

export type OpengraphImageConfigSerializableMaybeMocked =
  | OpengraphImageConfigSerializable
  | (() => OpengraphImageConfigSerializable);

export type OpengraphImageConfigResolved = {
  imageFormat: ImageFormat;
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
      addMiddleware({
        entrypoint: "@altano/astro-opengraph-image/middleware",
        order: "post",
      });
    },
  },
});
