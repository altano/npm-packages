import opengraphTemplate from "./_opengraph.png.astro";
import { makeOpengraphDevEndpoint } from "../../../../../../src/endpoint.js";

export const GET: APIRoute = makeOpengraphDevEndpoint({
  template: opengraphTemplate,
});
