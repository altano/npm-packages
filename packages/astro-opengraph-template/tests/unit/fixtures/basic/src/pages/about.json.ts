// Outputs: /builtwith.json
export async function GET() {
  return new Response(
    JSON.stringify({
      name: "Astro",
      url: "https://astro.build/",
    }),
  );
}
