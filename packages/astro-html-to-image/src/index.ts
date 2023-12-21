import { defineMiddleware } from "astro/middleware";
import satori from "satori";
import { html as htmlToVNode } from "satori-html";
import { contentType } from "mime-types";
import he from "he";
import { transformImage } from "./transformImage";

import type { MiddlewareHandler, APIContext } from "astro";
import type { SatoriOptions } from "satori";

export type SvgOptions = SatoriOptions;
export type ImageFormat = "png";
export type ImageOptions<Format extends ImageFormat> = {
  format: Format;
};

type Filename<Format extends ImageFormat> = `${string}.${Format}`;

export type Options<Format extends ImageFormat> = {
  /**
   * Any output format that your configured image service accepts.
   */
  format: Format;
  /**
   * Options that the vercel/satori library accepts. At the very least, you must
   * specify dimensions and one font to use.
   *
   * API documentation:
   * https://github.com/vercel/satori/blob/0a258931fe2291bdd461103780ac01e3c700b845/src/satori.ts#L18-L40
   */
  getSvgOptions(
    context: APIContext,
    response: Response,
    format: Format,
  ): Promise<SvgOptions>;
  /**
   * This function must return true for the given request or the route will not
   * be converted to an image. By default, only components/endpoints that return
   * a text/html Response and have a route ending in "<name>.<format>", e.g.
   * image.png, will be converted to an image. Use this method to override that
   * behavior and provide your own heuristic.
   */
  shouldReplace?: (
    context: APIContext,
    response: Response,
    format: Format,
  ) => Promise<boolean>;
  /**
   * The default filename for a component such as `image.png.astro` is
   * `image.png`. You may use this function to override that default. Only
   * relevant in SSG: in SSR there is no filename and Astro just responds with
   * the file image contents.
   */
  getFilename?: (
    context: APIContext,
    response: Response,
    format: Format,
  ) => Promise<Filename<Format>>;
};

function getContentType<Format extends ImageFormat>(format: Format): string {
  const type = contentType(format);
  return type === false ? `image/${format}` : type;
}

export async function defaultGetFilename<Format extends ImageFormat>(
  format: Format,
  context: APIContext,
): Promise<string> {
  const requestUrl = context.url.toString();
  new RegExp(String.raw`\.${format}\/?$`).test(requestUrl);

  const basename = context.url.pathname.split("/").filter(Boolean).at(-1);

  if (basename == null) {
    throw new Error(
      `Could not find basename of URL: ${context.url.toString()}`,
    );
  }

  return basename;
}

export async function defaultShouldReplace<Format extends ImageFormat>(
  context: APIContext,
  response: Response,
  format: Format,
): Promise<boolean> {
  const contentType = response.headers?.get("content-type");

  // In SSG there will be a trailing slash in the request URL. In SSR/dev a
  // user might type it in without the slash. Handle both.
  const requestUrl = context.url.toString();
  const isImageOfType = new RegExp(String.raw`\.${format}\/?$`).test(
    requestUrl,
  );

  return (
    isImageOfType &&
    // Don't rewrite other things like Endpoints. Only interested in components.
    response instanceof Response &&
    // Don't rewrite anything that isn't html.
    contentType === "text/html"
  );
}

export function createHtmlToImageMiddleware<Format extends ImageFormat>({
  format,
  shouldReplace,
  getFilename,
  getSvgOptions,
}: Options<Format>): MiddlewareHandler {
  return defineMiddleware(async (context, next) => {
    const response = await next();

    const replace =
      shouldReplace == null
        ? await defaultShouldReplace(context, response, format)
        : await shouldReplace(context, response, format);

    if (!replace) {
      // This request isn't relevant to us. Don't modify the response.
      return response;
    }

    const [responseText, svgOptions, filename] = await Promise.all([
      response.text(),
      getSvgOptions(context, response, format),
      getFilename == null
        ? defaultGetFilename(format, context)
        : getFilename(context, response, format),
    ]);

    // html text => vnode
    const responseTextWithDecodedHtmlEntities = he.decode(responseText);
    const vnode = htmlToVNode(responseTextWithDecodedHtmlEntities);

    // vnode => svg
    const svg = await satori(vnode as React.ReactNode, svgOptions);

    // svg => image
    const fileBuffer = Buffer.from(svg, "utf-8");
    const image = await transformImage(fileBuffer, format);

    return new Response(image.data, {
      headers: {
        "Content-Type": getContentType(format),
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  });
}
