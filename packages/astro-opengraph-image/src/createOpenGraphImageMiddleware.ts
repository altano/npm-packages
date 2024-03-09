import {
  createHtmlToImageMiddleware,
  defaultShouldReplace,
} from "@altano/astro-html-to-image";
import type { APIContext, MiddlewareHandler } from "astro";
import { deserializeVirtualConfig } from "./config";

export type ImageFormat = "png";

export type ImageMiddlewareOptions = {
  format: ImageFormat;
};

const SvgDefaults = {
  width: 1200,
  height: 630,
} as const;

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
      // Grab the virtual module that holds the integration's user config
      const module = await import("virtual:opengraph-image/user-config");
      const lazyConfig = module.default;
      const resolvedConfig = await deserializeVirtualConfig(lazyConfig);
      const { svgOptions } = resolvedConfig;
      return Object.assign(SvgDefaults, svgOptions);
    },
  });
}

export function createOpenGraphImageMiddleware(): MiddlewareHandler {
  return createOpenGraphImageMiddlewareForFormat({
    format: "png",
  });
}
