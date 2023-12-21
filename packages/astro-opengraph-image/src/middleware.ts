import type { MiddlewareEndpointHandler } from "astro";
import { createOpenGraphImageMiddleware } from "./createOpenGraphImageMiddleware";

/**
 * The middleware
 */
export const onRequest: MiddlewareEndpointHandler =
  createOpenGraphImageMiddleware();
