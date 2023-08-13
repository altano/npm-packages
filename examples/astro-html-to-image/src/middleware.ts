import { sequence } from "astro/middleware";
import { createHtmlToImageMiddleware } from "@altano/astro-html-to-image";

import type { SatoriOptions } from "@altano/astro-html-to-image";

async function getSatoriOptions(): Promise<SatoriOptions> {
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

const pngMiddleware = createHtmlToImageMiddleware({
  format: "png",
  getSatoriOptions,
});

const jpgMiddleware = createHtmlToImageMiddleware({
  format: "jpg",
  getSharpOptions: async () => ({ quality: 1, effort: 1 }),
  getSatoriOptions,
});

export const onRequest = sequence(pngMiddleware, jpgMiddleware);
