import { createContext, defineMiddleware } from "astro/middleware";

import type { MiddlewareResponseHandler } from "astro";

export type HeaderMiddlewareOptions = {
  writeHeaders?: boolean;
};

const matchMiddleware: MiddlewareResponseHandler = async (context, next) => {
  const response = await next();

  console.log(`Matched on ${context.url.toString()}`);

  // TODO Handle pass-through
  return response;
};

export function createHeaderMiddleware({
  writeHeaders = true,
}: HeaderMiddlewareOptions): MiddlewareResponseHandler {
  return defineMiddleware(async (context, next) => {
    const response = await next();

    if (!writeHeaders) {
      return response;
    }

    return response;

    const thisPath = context.url.pathname;

    if (thisPath == null || thisPath === "" || thisPath === "/") {
      const imageCandidateURL = new URL(
        `/opengraph-image.png`,
        context.url,
      ).toString();
      console.log(`At root`, { imageCandidateURL });
      const image = await fetch(imageCandidateURL);
      const { ok, status } = image;
      console.log({ ok, status });
      if (
        image.ok &&
        image.status === 200 &&
        image.headers.get("content-type") === "image/png"
      ) {
        console.log(`Found image to rewrite: /opengraph-image.png`);
      }
      return response;
    }

    // const goodUrl = "/";
    // const goodRedirect = context.redirect(goodUrl);
    // const badUrl = "/faaaaaaaaaaaace";
    // const badRedirect = context.redirect(badUrl);

    // console.log(`Trying good URL`);

    // // matchMiddleware(createContext({request: new Request(goodUrl)}))

    // // const app = new App();
    // console.log({
    //   thisUrl: context.url.toString(),
    //   // redResponse: badRedirect,
    //   badStatus: badRedirect.status,
    //   goodStatus: goodRedirect.status,
    //   // context,
    // });

    // return response;

    // // const images = import.meta.glob("/**/*/opengraph-image.png.astro", {
    // //   eager: false,
    // // });
    // const images = import.meta.glob("/**/*/opengraph-image.png.astro", {
    //   eager: true,
    // });

    // console.log({
    //   images: Object.values(images).map((c) => ({
    //     url: c.url,
    //     meta: JSON.stringify(c.meta),
    //   })),
    //   url: context.url.toString(),
    //   pathname: context.url.pathname,
    // });

    // // TODO Handle endpoint passthrough
    // // TODO Rewrite headers here

    return response;
  });
}
