import type { SvgOptions, ImageFormat } from "@altano/astro-html-to-image";
import type { AstroIntegration } from "astro";
import { vitePluginOpengraphImageUserConfig } from "./virtual-user-config.js";

export type FontWithBuffer = SvgOptions["fonts"][0];
export type FontWithPath = Omit<FontWithBuffer, "data"> & { path: string };

type SvgOptionsBase = {
  width?: number;
  height?: number;
  debug?: boolean;
};
type SvgOptionsBaseResolved = {
  width: number;
  height: number;
  debug?: boolean;
};
export type SvgOptionsWithFontPaths = SvgOptionsBase & {
  fonts: FontWithPath[];
};
export type SvgOptionsWithFontBuffers = SvgOptionsBase & {
  fonts: FontWithBuffer[];
};
export type SvgOptionsWithFontBuffersResolved = SvgOptionsBaseResolved & {
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
  getSvgOptions(): Promise<SvgOptionsWithFontPaths>;
};

/**
 * This must remain JSON-serializable!
 */
export type OpengraphImageConfigSerializable = {
  imageFormat?: ImageFormat | undefined;
  svgOptions: SvgOptionsWithFontPaths;
};

export type OpengraphImageConfigSerializableMaybeMocked =
  | OpengraphImageConfigSerializable
  | (() => OpengraphImageConfigSerializable);

export type OpengraphImageConfigDeserialized = {
  imageFormat?: ImageFormat | undefined;
  svgOptions: SvgOptionsWithFontBuffers;
};

export type OpengraphImageConfigResolved = {
  imageFormat: ImageFormat;
  svgOptions: SvgOptionsWithFontBuffersResolved;
};

/**
 * The integration
 */
export default (config: OpengraphImageConfig): AstroIntegration => ({
  name: "astro-opengraph-image-endpoint",
  hooks: {
    async "astro:route:setup"({ route, logger }) {},
    async "astro:config:setup"({
      config: setupConfig,
      addMiddleware,
      command,
      updateConfig,
      injectRoute,
    }): Promise<void> {
      // setupConfig.
      console.log(
        `[astro-opengraph-image-endpoint => integration]: astro:config:setup START`,
      );
      const [svgOptions] = await Promise.all([config.getSvgOptions()]);
      const configSerializable: OpengraphImageConfigSerializable = {
        imageFormat: config.imageFormat,
        svgOptions,
      };
      updateConfig({
        vite: {
          // Shove the serializable config into the virtual module for later
          // retrieval in the middleware
          // @ts-ignore
          plugins: [vitePluginOpengraphImageUserConfig(configSerializable)],
        },
      });

      injectRoute({
        pattern: `/[...path]/opengraph-image.${config.imageFormat ?? "png"}`,
        entrypoint: "@altano/astro-opengraph-image-endpoint/endpoint-image",
      });
      if (command === "dev") {
        injectRoute({
          pattern: "/[...path]/opengraph-image.html",
          entrypoint: "@altano/astro-opengraph-image-endpoint/endpoint-html",
        });
      }
      // injectRoute({
      //   pattern: "/_test.json",
      //   entrypoint: "@altano/astro-opengraph-image-endpoint/endpoint",
      // });
      // injectRoute({
      //   pattern: "/json-test.json.ts",
      //   entrypoint: "@altano/astro-opengraph-image-endpoint/endpoint",
      // });
      // injectRoute({
      //   pattern: "/json-test2.json",
      //   entrypoint: "@altano/astro-opengraph-image-endpoint/json2-entrypoint",
      // });

      // addMiddleware({
      //   order: "post",
      //   // entrypoint: "@altano/astro-opengraph-image-endpoint/middleware",
      //   entrypoint: new URL("middleware", import.meta.url),
      // });
      console.log(
        `[astro-opengraph-image-endpoint => integration]: astro:config:setup END`,
      );
    },
  },
});
