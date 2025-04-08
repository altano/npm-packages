import opengraphTemplate from "./_opengraph.png.astro";
import { makeOpengraphEndpoint } from "../../../../../../../src/endpoint.ts";

export { getStaticPaths } from "./index.astro";

export const GET = makeOpengraphEndpoint({
  template: opengraphTemplate,
});
