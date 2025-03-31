import opengraphTemplate from "./_opengraph.png.astro";
import { makeOpengraphDevEndpoint } from "../../../../../src/endpoint.ts";
import type { APIRoute } from "astro";

export const GET: APIRoute = makeOpengraphDevEndpoint({
  template: opengraphTemplate,
});
