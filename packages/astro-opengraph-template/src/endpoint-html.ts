import type { APIRoute } from "astro";
import { renderTemplate } from "./endpoint-image.js";

// We can re-use the other endpoint's `getStaticPaths`, as it generates the same
// set of paths.
export { getStaticPaths } from "./endpoint-image.js";

export const GET: APIRoute = async ({
  params,
  url,
  // routePattern,
  // request
}) => {
  const renderedTemplate = await renderTemplate(
    params,
    url,
    // routePattern,
    // request,
  );

  return new Response(renderedTemplate, {
    headers: {
      "Content-Type": "text/html",
    },
  });
};
