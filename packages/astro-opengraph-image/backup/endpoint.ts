import type { APIRoute } from "astro";

export const get: APIRoute = async ({ params, request }) => {
  console.log(`in endpoint!`, { params, request });
  return new Response(`hi`, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
