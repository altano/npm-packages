import { getFontPath } from "@altano/assets";
import { vitest } from "vitest";
// TODO Move somewhere shared?
import { MockImageService } from "../../../astro-html-to-image/tests/utils/mockImageService";
import type { OpengraphImageConfigSerializable } from "../../src/integration";

export function getDefaultSvgOptions(): OpengraphImageConfigSerializable["svgOptions"] {
  const interRegularPath = getFontPath("Inter-Regular.ttf");
  const interBoldPath = getFontPath("Inter-Bold.ttf");
  return {
    fonts: [
      {
        name: "Inter Variable",
        path: interRegularPath,
        weight: 400,
        style: "normal",
      },
      {
        name: "Inter Variable",
        path: interBoldPath,
        weight: 800,
        style: "normal",
      },
    ],
  };
}

vitest.mock("astro:assets", () => {
  return {
    default: MockImageService,
    ...MockImageService,
  };
});
