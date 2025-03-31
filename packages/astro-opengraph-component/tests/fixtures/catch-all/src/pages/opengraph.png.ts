import opengraphTemplate from "../components/opengraph.astro";
import { makeOpengraphEndpoint } from "../../../../../src/endpoint.ts";

export const GET = makeOpengraphEndpoint({
  template: opengraphTemplate,
});
