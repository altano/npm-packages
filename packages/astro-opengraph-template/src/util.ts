import { contentType } from "mime-types";
import { getConfiguredImageService, imageConfig } from "astro:assets";

import type { LocalImageService, ImageOutputFormat } from "astro";

export async function transformImage(
  imageBuffer: Uint8Array,
  destinationFormat: ImageOutputFormat,
): ReturnType<LocalImageService["transform"]> {
  const imageService = (await getConfiguredImageService()) as LocalImageService;

  return imageService.transform(
    imageBuffer,
    { src: "", format: destinationFormat },
    imageConfig,
  );
}

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

export function getMimeType<Format extends ImageFormat>(
  format: Format,
): string {
  const type = contentType(format);
  return type === false ? `image/${format}` : type;
}
