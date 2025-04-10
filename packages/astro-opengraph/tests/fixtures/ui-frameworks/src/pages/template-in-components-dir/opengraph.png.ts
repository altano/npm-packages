import opengraphTemplate from "../../components/component.astro";
import { makeOpengraphEndpoint } from "../../../../../../src/endpoint.ts";

export const GET = makeOpengraphEndpoint({
  template: opengraphTemplate,
});
