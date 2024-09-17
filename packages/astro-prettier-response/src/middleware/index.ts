import { defineMiddleware } from "astro/middleware";
import { synthesizeFilename } from "./filename.js";
import { formatOrReturn } from "./format.js";
import { getFileInfo } from "./prettier.js";
import { is400 } from "./is400.js";
import { logger } from "@it-astro:logger:astro-prettier-response";
import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = defineMiddleware(
  async (context, next) => {
    const response = await next();

    // Only attempt formatting on Responses that are OK or have a 400 error (e.g.
    // redirect pages or 404 pages)
    if (!response.ok && !is400(response.status)) {
      logger.debug(`NOT formatting (status is not 2xx or 4xx)`);
      return response;
    }

    const filename = synthesizeFilename(response);
    if (filename == null) {
      logger.debug(`NOT formatting (couldn't determine filename/extension)`);
      return response;
    }
    const fileInfo = await getFileInfo(filename);
    if (fileInfo?.inferredParser == null) {
      logger.debug(
        `NOT formatting (Prettier has no parser for this file type)`,
      );
      return response;
    }

    const clone = response.clone();
    const source = await clone.text();
    const processedSource = await formatOrReturn(filename, source);

    return new Response(processedSource, {
      status: response.status,
      headers: clone.headers,
      statusText: clone.statusText,
    });
  },
);
