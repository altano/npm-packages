import { sequence } from "astro/middleware";
import {
  createHtmlToImageMiddleware,
  defaultShouldReplace,
} from "@altano/astro-html-to-image";

import type { SatoriOptions } from "@altano/astro-html-to-image";
import type { APIContext, MiddlewareResponseHandler } from "astro";

export type ImageFormat = "jpg" | "png" | "gif";

export type ImageMiddlewareOptions = {
  format: ImageFormat;
  getSatoriOptions: (
    context: APIContext,
    response: Response,
    image: ImageFormat,
  ) => Promise<Partial<SatoriOptions>>;
};

const SatoriDefaults = {
  width: 1200,
  height: 630,
  fonts: [],
} as const;

function createImageMiddlewareForFormat({
  format,
  getSatoriOptions: providedOptions,
}: ImageMiddlewareOptions): MiddlewareResponseHandler {
  return createHtmlToImageMiddleware({
    format,
    async shouldReplace(
      context: APIContext,
      response: Response,
      format: ImageFormat,
    ): Promise<boolean> {
      const passesDefaultChecks = await defaultShouldReplace(
        context,
        response,
        format,
      );

      if (!passesDefaultChecks) {
        return false;
      }

      // The default checks pass. Now let's make sure we're specifically
      // processing an opengraph-image.png/jpg/etc route.
      const requestUrl = context.url.toString();
      return (
        requestUrl.endsWith(`opengraph-image.${format}`) ||
        requestUrl.endsWith(`opengraph-image.${format}/`)
      );
    },
    async getSatoriOptions(context, response, image) {
      const options = await providedOptions(context, response, image);
      return Object.assign(SatoriDefaults, options);
    },
  });
}

export function createImageMiddleware(
  options: Omit<ImageMiddlewareOptions, "format">,
): MiddlewareResponseHandler {
  const pngMiddleware = createImageMiddlewareForFormat({
    ...options,
    format: "png",
  });
  const jpgMiddleware = createImageMiddlewareForFormat({
    ...options,
    format: "jpg",
  });
  const gifMiddleware = createImageMiddlewareForFormat({
    ...options,
    format: "gif",
  });
  return sequence(pngMiddleware, jpgMiddleware, gifMiddleware);
}
