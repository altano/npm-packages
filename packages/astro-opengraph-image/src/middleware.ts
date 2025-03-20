import type { MiddlewareHandler } from "astro";
import { createOpenGraphImageMiddleware } from "./createOpenGraphImageMiddleware.js";

/**
 * The middleware
 */
export const onRequest: MiddlewareHandler =
  await createOpenGraphImageMiddleware();
