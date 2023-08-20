import { createOpenGraphImageMiddleware } from "@altano/astro-opengraph-image";

export const onRequest = createOpenGraphImageMiddleware({
  runtime: "nodejs",
  async getSvgOptions() {
    const interRegularBuffer = await fetch(
      `https://rsms.me/inter/font-files/Inter-Regular.woff`,
    ).then((res) => res.arrayBuffer());
    const interBoldBuffer = await fetch(
      `https://rsms.me/inter/font-files/Inter-Bold.woff`,
    ).then((res) => res.arrayBuffer());
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
