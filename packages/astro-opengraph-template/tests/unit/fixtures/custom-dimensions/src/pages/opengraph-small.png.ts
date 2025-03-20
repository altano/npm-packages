import type { APIRoute } from "astro";
import opengraphTemplate from "./_opengraph.png.astro";
import { makeOpengraphEndpoint } from "../../../../../../src/endpoint.ts";

export const GET: APIRoute = makeOpengraphEndpoint({
  template: opengraphTemplate,
  svgOptionOverrides: {
    width: 200,
    height: 200,
  },
});
