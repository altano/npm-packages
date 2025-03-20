import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request /*, ...rest*/ }) => {
  const object = {
    name: "Endpoint2!!",
  };

  return new Response(JSON.stringify(object), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
