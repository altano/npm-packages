import {
  createHtmlToImageMiddleware,
  defaultShouldReplace,
  type ImageFormat,
} from "@altano/astro-html-to-image";
import type { APIContext, MiddlewareHandler } from "astro";
import { getResolvedConfig } from "./config";

export type ImageMiddlewareOptions = {
  format: ImageFormat;
};

function createOpenGraphImageMiddlewareForFormat({
  format,
}: ImageMiddlewareOptions): MiddlewareHandler {
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
    async getSvgOptions() {
      const { svgOptions } = await getResolvedConfig();
      return svgOptions;
    },
  });
}

export async function createOpenGraphImageMiddleware(): Promise<MiddlewareHandler> {
  const { imageFormat } = await getResolvedConfig();
  return createOpenGraphImageMiddlewareForFormat({
    format: imageFormat,
  });
}
