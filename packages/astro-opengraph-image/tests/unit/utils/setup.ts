import { getInterPath } from "@altano/assets";
import { vitest } from "vitest";
// TODO Move somewhere shared?
import { MockImageService } from "../../../../astro-html-to-image/tests/unit/utils/mockImageService.js";
import type { OpengraphImageConfigSerializable } from "../../../src/integration.js";

export function getDefaultSvgOptions(): OpengraphImageConfigSerializable["svgOptions"] {
  const interRegularPath = getInterPath(400);
  const interBoldPath = getInterPath(700);
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
