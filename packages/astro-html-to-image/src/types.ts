import type { SatoriOptions } from "satori";

export type SvgOptions = SatoriOptions;

/**
 * Any output format that your Astro image service accepts, as a string.
 *
 * Astro's default image service, sharp, supports "avif", "jpg", "png", "webp",
 * "gif", etc. API documentation: https://sharp.pixelplumbing.com/api-output
 */

export type ImageFormat = string;

export type ImageOptions<Format extends ImageFormat> = {
  format: Format;
};
export type Filename<Format extends ImageFormat> = `${string}.${Format}`;
