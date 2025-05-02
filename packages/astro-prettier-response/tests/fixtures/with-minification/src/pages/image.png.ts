import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  return new Response(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2O4v3EyBwAGwgIsY3pRcwAAAABJRU5ErkJggg==",
    {
      headers: {
        "Content-Type": "image/png",
      },
    },
  );
};
