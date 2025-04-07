import type { SatoriOptions } from "satori";

export type ImageOptions = SatoriOptions;

export type FontWithBuffer = ImageOptions["fonts"][0];
export type FontWithPath = Omit<FontWithBuffer, "data"> & { path: string };
type ImageOptionsBase = {
  width?: number;
  height?: number;
  debug?: boolean;
};
type ImageOptionsBaseResolved = {
  width: number;
  height: number;
  debug?: boolean;
};
export type ImageOptionsWithFontPaths = ImageOptionsBase & {
  fonts: FontWithPath[];
};
export type ImageOptionsWithFontBuffers = ImageOptionsBase & {
  fonts: FontWithBuffer[];
};
export type ImageOptionsWithFontBuffersResolved = ImageOptionsBaseResolved & {
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
   * Options to use for the image file that is generated. Most importantly, fonts
   * must be provided.
   */
  getImageOptions(): Promise<ImageOptionsWithFontPaths>;
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
  imageOptions: ImageOptionsWithFontPaths;
  componentMetaTagFallbacks?: ComponentMetaTagFallbacks;
  command: Command;
};

export type OpengraphImageConfigSerializableMaybeMocked =
  | OpengraphImageConfigSerializable
  | (() => OpengraphImageConfigSerializable);

export type OpengraphImageConfigDeserialized = {
  imageOptions: ImageOptionsWithFontBuffers;
  componentMetaTagFallbacks?: ComponentMetaTagFallbacks | undefined;
  command: Command;
};

export type OpengraphImageConfigResolved = {
  imageOptions: ImageOptionsWithFontBuffersResolved;
  componentMetaTagFallbacks: ComponentMetaTagFallbacks & MetaTagDefaults;
  command: Command;
};
