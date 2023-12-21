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
