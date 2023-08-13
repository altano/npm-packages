import satori from "satori";
import { defineMiddleware } from "astro/middleware";
import sharp, { type Sharp, type FormatEnum as SharpFormatEnum } from "sharp";
import { html as htmlToVNode } from "satori-html";
import { contentType } from "mime-types";
import he from "he";

import type { MiddlewareResponseHandler, APIContext } from "astro";
import type { SatoriOptions as SatoriOptionsOrig } from "satori";

export type SatoriOptions = SatoriOptionsOrig;
export type SharpOptions = NonNullable<Parameters<Sharp["toFormat"]>[1]>;
export type SharpFormats = keyof SharpFormatEnum;

// TODO Needs lots of tests

export type ImageOptions<Format extends SharpFormats> = {
  format: Format;
  options?: SharpOptions;
};

type Filename<Format extends SharpFormats> = `${string}.${Format}`;

export type Options<Format extends SharpFormats> = {
  /**
   * Any output format that the sharp library accepts, as a string.
   * e.g. "avif", "jpg", "png", "webp", "gif", etc.
   *
   * API documentation: https://sharp.pixelplumbing.com/api-output
   */
  format: Format;
  /**
   * Options that the vercel/satori library accepts. At the very least, you must
   * specify dimensions and one font to use.
   *
   * API documentation:
   * https://github.com/vercel/satori/blob/0a258931fe2291bdd461103780ac01e3c700b845/src/satori.ts#L18-L40
   */
  getSatoriOptions(
    context: APIContext,
    response: Response,
    format: Format,
  ): Promise<SatoriOptions>;
  /**
   * Any output options that the sharp library accepts, e.g.:
   *
   *   { quality: 50 }
   *
   * API documentation: https://sharp.pixelplumbing.com/api-output#toformat
   */
  getSharpOptions?: (
    context: APIContext,
    response: Response,
    format: Format,
  ) => Promise<SharpOptions>;
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

function getContentType<Format extends SharpFormats>(format: Format): string {
  const type = contentType(format);
  return type === false ? `image/${format}` : type;
}

async function defaultGetFilename<Format extends SharpFormats>(
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

async function defaultGetSharpOptions(): Promise<SharpOptions> {
  return { quality: 100 };
}

async function defaultShouldReplace<Format extends SharpFormats>(
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

export function createHtmlToImageMiddleware<Format extends SharpFormats>({
  format,
  getSharpOptions,
  shouldReplace,
  getFilename,
  getSatoriOptions,
}: Options<Format>): MiddlewareResponseHandler {
  return defineMiddleware(async (context, next) => {
    const response = await next();
    const replace =
      shouldReplace == null
        ? await defaultShouldReplace(context, response, format)
        : await shouldReplace(context, response, format);

    if (!replace) {
      // This request isn't relevant to us. Don't modify the response.

      // TODO Remove when issue is fixed in astro
      // https://github.com/withastro/astro/issues/8045
      if (isEndpointOutput(response)) {
        return new Response(response.body, {
          status: 200,
          headers: response.headers,
        });
      }

      return response;
    }

    const [responseText, satoriOptions, sharpOptions, filename] =
      await Promise.all([
        response.text(),
        getSatoriOptions(context, response, format),
        getSharpOptions == null
          ? defaultGetSharpOptions()
          : getSharpOptions(context, response, format),
        getFilename == null
          ? defaultGetFilename(format, context)
          : getFilename(context, response, format),
      ]);

    // html text => vnode
    const responseTextWithDecodedHtmlEntities = he.decode(responseText);
    const vnode = htmlToVNode(responseTextWithDecodedHtmlEntities);

    // vnode => svg
    const svg = await satori(vnode as React.ReactNode, satoriOptions);

    // svg => image
    const imageBuffer = await sharp(Buffer.from(svg))
      .toFormat(format, sharpOptions)
      .toBuffer();

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": getContentType(format),
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  });
}

function isEndpointOutput(endpointResult: unknown): boolean {
  return (
    endpointResult != null &&
    !(endpointResult instanceof Response) &&
    typeof endpointResult === "object" &&
    "body" in endpointResult &&
    typeof endpointResult.body === "string"
  );
}
