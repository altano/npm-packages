import {
  createHtmlToImageMiddleware,
  defaultShouldReplace,
} from "@altano/astro-html-to-image";

import type { Runtime, SvgOptions } from "@altano/astro-html-to-image";
import type { APIContext, MiddlewareResponseHandler } from "astro";

export type ImageFormat = "png";

export type ImageMiddlewareOptions = {
  runtime: Runtime;
  format: ImageFormat;
  getSvgOptions: (
    context: APIContext,
    response: Response,
    image: ImageFormat,
  ) => Promise<Partial<SvgOptions>>;
};

const SvgDefaults = {
  width: 1200,
  height: 630,
  fonts: [],
} as const;

function createImageMiddlewareForFormat({
  runtime,
  format,
  getSvgOptions: providedOptions,
}: ImageMiddlewareOptions): MiddlewareResponseHandler {
  return createHtmlToImageMiddleware({
    runtime,
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
    async getSvgOptions(context, response, image) {
      const options = await providedOptions(context, response, image);
      return Object.assign(SvgDefaults, options);
    },
  });
}

export function createImageMiddleware(
  options: Omit<ImageMiddlewareOptions, "format">,
): MiddlewareResponseHandler {
  return createImageMiddlewareForFormat({
    ...options,
    format: "png",
  });
}
