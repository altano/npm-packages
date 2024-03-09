import type { MiddlewareHandler } from "astro";
import { createOpenGraphImageMiddleware } from "./createOpenGraphImageMiddleware";

/**
 * The middleware
 */
export const onRequest: MiddlewareHandler = createOpenGraphImageMiddleware();
