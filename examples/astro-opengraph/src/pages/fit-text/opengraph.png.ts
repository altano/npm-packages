import opengraphTemplate from "./_opengraph.png.astro";
import { makeOpengraphEndpoint } from "@altano/astro-opengraph/endpoint";

export const GET = makeOpengraphEndpoint({
  template: opengraphTemplate,
});
