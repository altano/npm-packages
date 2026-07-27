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

  // Astro 7 disables SVG rasterization in the sharp image service by default
  // (`image.dangerouslyProcessSVG`). Our input is an SVG we produced ourselves
  // with satori, so enable rasterization for *this transform only* by passing a
  // scoped config override. We intentionally do NOT flip the global
  // `image.dangerouslyProcessSVG` config, which is a project-wide security
  // decision the user must make for the other SVGs they process.
  return imageService.transform(
    imageBuffer,
    { src: "", format: "png" },
    { ...imageConfig, dangerouslyProcessSVG: true },
  );
}
