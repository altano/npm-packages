import { getConfiguredImageService, imageConfig } from "astro:assets";
import satori, { type SatoriOptions } from "satori";
import { html as htmlToVNode } from "satori-html";
import he from "he";

import type { LocalImageService } from "astro";

/**
 * Convert an html string to an image
 */
export async function htmlToPNG(
  html: string,
  satoriOptions: SatoriOptions,
): Promise<ReturnType<LocalImageService["transform"]>> {
  // html text => vnode
  const responseTextWithDecodedHtmlEntities = he.decode(html);
  const vnode = htmlToVNode(responseTextWithDecodedHtmlEntities);

  // vnode => svg
  const svg = await satori(vnode as React.ReactNode, satoriOptions);

  // svg => buffer
  const fileBuffer = Buffer.from(svg, "utf-8");
  const uint8Array = new Uint8Array(
    fileBuffer.buffer,
    fileBuffer.byteOffset,
    fileBuffer.byteLength,
  );

  // buffer => transformed png
  return bufferToTransformedPNG(uint8Array);
}

/**
 * Convert a buffer to an image using the astro local image service
 */
async function bufferToTransformedPNG(
  imageBuffer: Uint8Array,
): ReturnType<LocalImageService["transform"]> {
  const imageService = (await getConfiguredImageService()) as LocalImageService;

  return imageService.transform(
    imageBuffer,
    { src: "", format: "png" },
    imageConfig,
  );
}
