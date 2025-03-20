import { readFile } from "node:fs/promises";
import { createHtmlToImageMiddleware } from "@altano/astro-html-to-image";
import { getInterPath } from "@altano/assets";

import type { SvgOptions } from "@altano/astro-html-to-image";

async function getSvgOptions(): Promise<SvgOptions> {
  const interRegularBuffer = await readFile(getInterPath(400));
  const interBoldBuffer = await readFile(getInterPath(700));
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
