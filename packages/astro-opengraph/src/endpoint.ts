import type { APIRoute } from "astro";
import { experimental_AstroContainer } from "astro/container";
import { isAstroComponentFactory } from "astro/runtime/server/render/astro/factory.js";
import { getResolvedConfig } from "./config.js";
import type { ImageOptions } from "./types.js";
import { htmlToPNG } from "./image.js";

type Options = {
  // We don't just type this as `AstroComponentFactory` because astro typing is
  // hard to get right and simply importing a .astro file doesn't give you
  // something typed as a factory.
  template: unknown;
  /**
   * Custom "Content-Type" header, only used in SSR. Defaults to "image/png"
   */
  contentType?: string;
  imageOptionOverrides?: Partial<ImageOptions>;
};

export function makeOpengraphDevEndpoint({
  template,
  contentType = "text/html",
}: Options): APIRoute {
  return async ({ locals, params, props, request }) => {
    const config = await getResolvedConfig();
    if (config.command !== "dev") {
      return new Response(null, { status: 404 });
    }

    if (!isAstroComponentFactory(template)) {
      throw new Error(`Given is not an Astro template.`);
    }

    const container = await experimental_AstroContainer.create();
    const templateStr = await container.renderToString(template, {
      partial: false,
      request,
      params,
      locals,
      props,
    });

    return new Response(templateStr, {
      headers: {
        "Content-Type": contentType,
      },
    });
  };
}

export function makeOpengraphEndpoint({
  template,
  imageOptionOverrides,
  contentType = "image/png",
}: Options): APIRoute {
  return async ({ locals, params, props, request }) => {
    if (!isAstroComponentFactory(template)) {
      throw new Error(`Given is not an Astro template.`);
    }

    const container = await experimental_AstroContainer.create();
    const templateStr = await container.renderToString(template, {
      partial: false,
      request,
      params,
      locals,
      props,
    });

    const config = await getResolvedConfig();
    const imageOptions = {
      ...config.imageOptions,
      ...imageOptionOverrides,
    };
    const png = await htmlToPNG(templateStr, imageOptions);

    return new Response(png.data, {
      headers: {
        "Content-Type": contentType,
      },
    });
  };
}
