import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  return new Response(
    `
    {
          name: "Astro",
      url:       "https://astro.build/", }`,
    {
      headers: {
        "content-type": "application/json",
      },
    },
  );
};
