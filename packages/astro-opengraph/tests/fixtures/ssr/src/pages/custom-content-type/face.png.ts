import opengraphTemplate from "../_opengraph.png.astro";
import { makeOpengraphEndpoint } from "../../../../../../src/endpoint.ts";

export const GET = makeOpengraphEndpoint({
  template: opengraphTemplate,
  contentType: "content-facetype",
});
