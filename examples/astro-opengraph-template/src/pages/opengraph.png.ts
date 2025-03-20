import type { APIRoute } from "astro";
import opengraphTemplate from "./_opengraph.png.astro";
import { makeOpengraphEndpoint } from "@altano/astro-opengraph-template/endpoint";

export const GET: APIRoute = makeOpengraphEndpoint({
  template: opengraphTemplate,
});
