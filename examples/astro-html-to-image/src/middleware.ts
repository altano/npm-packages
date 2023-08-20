import { createHtmlToImageMiddleware } from "@altano/astro-html-to-image";

import type { SvgOptions } from "@altano/astro-html-to-image";

async function getSvgOptions(): Promise<SvgOptions> {
  const interRegularBuffer = await fetch(
    `https://rsms.me/inter/font-files/Inter-Regular.woff`,
  ).then((res) => res.arrayBuffer());
  const interBoldBuffer = await fetch(
    `https://rsms.me/inter/font-files/Inter-Bold.woff`,
  ).then((res) => res.arrayBuffer());
  return {
    width: 800,
    height: 200,
    fonts: [
      {
        name: "Inter Variable",
        data: interRegularBuffer,
        weight: 400,
        style: "normal",
      },
      {
        name: "Inter Variable",
        data: interBoldBuffer,
        weight: 800,
        style: "normal",
      },
    ],
  };
}

export const onRequest = createHtmlToImageMiddleware({
  runtime: "nodejs",
  format: "png",
  getSvgOptions,
});
