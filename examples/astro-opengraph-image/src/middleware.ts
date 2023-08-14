import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { createOpenGraphImageMiddleware } from "@altano/astro-opengraph-image";

export const onRequest = createOpenGraphImageMiddleware({
  async getSatoriOptions() {
    const interRegularBuffer = await readFile(
      path.join(
        fileURLToPath(import.meta.url),
        "../../../../packages/astro-html-to-image/tests/artifacts/fonts/Inter-Regular.ttf",
      ),
    );
    const interBoldBuffer = await readFile(
      path.join(
        fileURLToPath(import.meta.url),
        "../../../../packages/astro-html-to-image/tests/artifacts/fonts/Inter-Bold.ttf",
      ),
    );
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
