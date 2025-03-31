import opengraphTemplate from "./_opengraph.png.astro";
import { makeOpengraphEndpoint } from "@altano/astro-opengraph-component/endpoint";

export { getStaticPaths } from "./index.astro";

export const GET = makeOpengraphEndpoint({
  template: opengraphTemplate,
});
