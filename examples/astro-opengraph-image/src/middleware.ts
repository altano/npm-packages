import { readFile } from "node:fs/promises";
import { createOpenGraphImageMiddleware } from "@altano/astro-opengraph-image";
import { getFontPath } from "@altano/assets";

export const onRequest = createOpenGraphImageMiddleware({
  runtime: "nodejs",
  async getSvgOptions() {
    const interRegularBuffer = await readFile(getFontPath("Inter-Regular.ttf"));
    const interBoldBuffer = await readFile(getFontPath("Inter-Bold.ttf"));
    return {
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
  },
});
