import satori from "satori";
import { defineMiddleware } from "astro/middleware";
import { Resvg } from "@resvg/resvg-wasm";
import { html as htmlToVNode } from "satori-html";
import { contentType } from "mime-types";
import he from "he";

import type { MiddlewareResponseHandler, APIContext } from "astro";
import type { SatoriOptions } from "satori";
import type { ResvgRenderOptions } from "@resvg/resvg-wasm";

export type SvgOptions = SatoriOptions;
export type ImageRenderOptions = ResvgRenderOptions;
export type ImageFormat = "png";

// TODO Needs lots of tests

export type ImageOptions<Format extends ImageFormat> = {
  format: Format;
  options?: ImageRenderOptions;
};

type Filename<Format extends ImageFormat> = `${string}.${Format}`;

export type Runtime = "nodejs";

export async function initialize({
  runtime,
}: {
  runtime: Runtime;
}): Promise<void> {
  switch (runtime) {
    case "nodejs":
      {
        const initialize = await import("./initializeResvg-Nodejs");
        await initialize.default();
      }
      break;
    default:
      runtime satisfies never;
  }
}

export type Options<Format extends ImageFormat> = {
  /**
   * Your JavaScript runtime, e.g. "nodejs"
   */
  runtime: Runtime;
  /**
   * Any output format that @resvg/resvg-wasm library accepts, as a string.
   * Currently only "png"
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
   * Any output options that the @resvg/resvg-js library accepts, e.g.:
   *
   *   { background: "rgba(255,255,255, 0.8)" }
   *
   * API documentation: https://github.com/yisibl/resvg-js/blob/main/index.d.ts#L3
   */
  getImageOptions?: (
    context: APIContext,
    response: Response,
    format: Format,
  ) => Promise<ImageRenderOptions>;
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

export async function defaultGetImageOptions(): Promise<ImageRenderOptions> {
  return {
    textRendering: 1, // optimizeLegibility
    imageRendering: 0, // optimizeQuality
  };
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

let isWasmInitialized = false;

export function createHtmlToImageMiddleware<Format extends ImageFormat>({
  runtime,
  format,
  getImageOptions,
  shouldReplace,
  getFilename,
  getSvgOptions,
}: Options<Format>): MiddlewareResponseHandler {
  return defineMiddleware(async (context, next) => {
    if (!isWasmInitialized) {
      isWasmInitialized = true;
      try {
        await initialize({ runtime });
      } catch (err) {
        // Restarting the dev server causes us to unnecessarily initialize the
        // wasm module twice. Let's just ignore the error (since we can't
        // prevent it).
        const shouldIgnore =
          err instanceof Error &&
          err.message?.startsWith("Already initialized");
        if (!shouldIgnore) {
          // re-throw all other errors
          throw err;
        }
      }
    }

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

    const [responseText, svgOptions, imageOptions, filename] =
      await Promise.all([
        response.text(),
        getSvgOptions(context, response, format),
        getImageOptions == null
          ? defaultGetImageOptions()
          : getImageOptions(context, response, format),
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
    const imageResvgArr = new Resvg(svg, imageOptions).render().asPng();
    const imageBuffer = Buffer.from(imageResvgArr);

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
