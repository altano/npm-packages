// import {
//   createImageMiddleware,
//   type ImageMiddlewareOptions,
// } from "./createImageMiddleware";
// import {
//   createHeaderMiddleware,
//   type HeaderMiddlewareOptions,
// } from "./createHeaderMiddleware";
// import { sequence } from "astro/middleware";

// export * from "./openGraphImageIntegration";

// import type { MiddlewareResponseHandler } from "astro";
// export type Options = ImageMiddlewareOptions & HeaderMiddlewareOptions;

// export function createOpenGraphImageMiddleware(
//   options: Omit<Options, "format">,
// ): MiddlewareResponseHandler {
//   return sequence(
//     createImageMiddleware(options),
//     createHeaderMiddleware(options),
//   );
// }

import { createImageMiddleware } from "../src/createImageMiddleware";

export const createOpenGraphImageMiddleware = createImageMiddleware;
