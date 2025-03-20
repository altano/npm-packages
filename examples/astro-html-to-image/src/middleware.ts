import { readFile } from "node:fs/promises";
import { createHtmlToImageMiddleware } from "@altano/astro-html-to-image";
import { getFontPath } from "@altano/assets";

import type { SvgOptions } from "@altano/astro-html-to-image";

async function getSvgOptions(): Promise<SvgOptions> {
  const interRegularBuffer = await readFile(getFontPath("Inter-Regular.ttf"));
  const interBoldBuffer = await readFile(getFontPath("Inter-Bold.ttf"));
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
  format: "png",
  getSvgOptions,
});
