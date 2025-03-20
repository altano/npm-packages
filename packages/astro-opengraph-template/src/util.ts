// transformImage.ts
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

// getMimeType.ts
import { contentType } from "mime-types";
// import type { ImageFormat } from "./types.js";

export function getMimeType<Format extends ImageFormat>(
  format: Format,
): string {
  const type = contentType(format);
  return type === false ? `image/${format}` : type;
}

// types.ts
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

// -------------
import { getInterPath } from "@altano/assets";
import { readFile } from "node:fs/promises";
// TODO Move somewhere shared?

export async function getSvgOptions(): Promise<SvgOptions> {
  const interRegularBuffer = await readFile(getInterPath(400));
  const interBoldBuffer = await readFile(getInterPath(700));
  return {
    width: 800,
    height: 200,
    fonts: [
      {
        name: "Inter Variable",
        data: interRegularBuffer,
        weight: 400,
        style: "normal",
      },
      {
        name: "Inter Variable",
        data: interBoldBuffer,
        weight: 800,
        style: "normal",
      },
    ],
  };
}
