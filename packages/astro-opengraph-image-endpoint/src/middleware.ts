import { defineMiddleware } from "astro/middleware";
import type { MiddlewareHandler } from "astro";
import { getResolvedConfig } from "./config.js";
// import { createOpenGraphImageMiddleware } from "./createOpenGraphImageMiddleware.js";

/**
 * The middleware
 */
// export const onRequest: MiddlewareHandler =
//   await createOpenGraphImageMiddleware();

export const onRequest: MiddlewareHandler = await createMiddleware();

async function createMiddleware(): Promise<MiddlewareHandler> {
  const { imageFormat } = await getResolvedConfig();
  return defineMiddleware(async (context, next) => {
    const response = await next();

    console.log(
      `[astro-opengraph-image-endpoint => middleware] imageFormat=${imageFormat}`,
    );

    const requestUrl = context.url.toString();

    // const isJsonUrl = new RegExp(String.raw`\.json\/?$`).test(requestUrl);
    // if (isJsonUrl) {
    //   console.log(
    //     `[astro-opengraph-image-endpoint => middleware] REDIRECTING ${requestUrl} to JSON endpoint`,
    //   );
    //   const endpointUrl = new URL("/json-test.json.ts", context.url);
    //   endpointUrl.searchParams.append("from", context.url.pathname);
    //   return context.rewrite(
    //     new Request(endpointUrl, {
    //       headers: {
    //         "x-redirect-by": context.url.pathname,
    //       },
    //     }),
    //   );
    // }

    const isImageOfType = new RegExp(String.raw`\.${imageFormat}\/?$`).test(
      requestUrl,
    );

    if (!isImageOfType) {
      console.log(
        `[astro-opengraph-image-endpoint => middleware] no replacement for ${requestUrl}`,
      );
      // This request isn't relevant to us. Don't modify the response.
      return response;
    }

    // @TODO handle this better... should be completely removing astro template routes before we even get here.
    return new Response(null, {
      status: 404,
    });

    console.log(
      `[astro-opengraph-image-endpoint => middleware] REDIRECTING ${requestUrl} to opengraph endpoint`,
    );

    const endpointUrl = new URL("/_test.json", context.url);
    endpointUrl.searchParams.append("from", context.url.pathname);

    return context.rewrite(
      new Request(endpointUrl, {
        headers: {
          "x-redirect-by": context.url.pathname,
        },
      }),
    );
  });
}
