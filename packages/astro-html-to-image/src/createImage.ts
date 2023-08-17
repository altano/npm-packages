/// <reference types="astro/client-image" />

import mime from "mime/lite.js";
// import { etag } from './utils/etag.js';
import { getConfiguredImageService } from "astro:assets";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { imageServiceConfig } from "astro:assets";

import type { LocalImageService, ImageService } from "astro";

export type ImageMetadataFace = ImageMetadata;

function isLocalService(service: ImageService): service is LocalImageService {
  return "transform" in service;
}

export default async function createImage(
  inputBuffer: Buffer,
  request: Request,
): Promise<Response> {
  const imageService = await getConfiguredImageService();

  const url = new URL(request.url);

  if (!isLocalService(imageService)) {
    throw new Error("Configured image service is not a local service");
  }

  const transform = await imageService.parseURL(url, imageServiceConfig);

  // if (!transform?.src) {
  //   throw new Error("Incorrect transform returned by `parseURL`");
  // }

  const { data, format } = await imageService.transform(
    inputBuffer,
    transform,
    imageServiceConfig,
  );

  return new Response(data, {
    status: 200,
    headers: {
      "Content-Type": mime.getType(format) ?? `image/${format}`,
      // "Cache-Control": "public, max-age=31536000",
      // ETag: etag(data.toString()),
      Date: new Date().toUTCString(),
    },
  });
}
