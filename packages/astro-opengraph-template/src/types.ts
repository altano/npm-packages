import type { SatoriOptions } from "satori";

/**
 * Any output format that your Astro image service accepts, as a string.
 *
 * Astro's default image service, sharp, supports "avif", "jpg", "png", "webp",
 * "gif", etc. API documentation: https://sharp.pixelplumbing.com/api-output
 */
type ImageFormat = string;

// export type ImageOptions<Format extends ImageFormat> = {
//   format: Format;
// };
// export type Filename<Format extends ImageFormat> = `${string}.${Format}`;

export type SvgOptions = SatoriOptions;

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

export type ComponentMetaTagFallbacks = {
  "og:title"?: string;
  "og:description"?: string;
  "og:image"?: string;
};

export type MetaTagDefaults = {
  "og:image": string;
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
  /**
   * Defaults to use in the component for tags you don't manually set.
   */
  componentMetaTagFallbacks?: ComponentMetaTagFallbacks;
};

type AstroConfigSetupHookOptions = Parameters<
  Astro.IntegrationHooks["astro:config:setup"]
>[0];
type Command = AstroConfigSetupHookOptions["command"];

/**
 * This must remain JSON-serializable!
 */
export type OpengraphImageConfigSerializable = {
  imageFormat?: ImageFormat | undefined;
  svgOptions: SvgOptionsWithFontPaths;
  componentMetaTagFallbacks?: ComponentMetaTagFallbacks;
  command: Command;
};

export type OpengraphImageConfigSerializableMaybeMocked =
  | OpengraphImageConfigSerializable
  | (() => OpengraphImageConfigSerializable);

export type OpengraphImageConfigDeserialized = {
  imageFormat?: ImageFormat | undefined;
  svgOptions: SvgOptionsWithFontBuffers;
  componentMetaTagFallbacks?: ComponentMetaTagFallbacks | undefined;
  command: Command;
};

export type OpengraphImageConfigResolved = {
  imageFormat: ImageFormat;
  svgOptions: SvgOptionsWithFontBuffersResolved;
  componentMetaTagFallbacks: ComponentMetaTagFallbacks & MetaTagDefaults;
  command: Command;
};
