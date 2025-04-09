import opengraphTemplate from "./_opengraph.png.astro";
import { makeOpengraphEndpoint } from "../../../../../src/endpoint.js";

export const GET = makeOpengraphEndpoint({
  template: opengraphTemplate,
  imageOptionOverrides: {
    width: 200,
    height: 200,
  },
});
