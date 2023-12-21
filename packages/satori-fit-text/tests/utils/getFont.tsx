import { getFontPath } from "@altano/assets";
import { readFile } from "node:fs/promises";

import type { Font } from "../../src/types";

export async function getFont(): Promise<Font> {
  const interSemiBoldBuffer = await readFile(getFontPath("Inter-SemiBold.ttf"));
  return {
    name: "Inter",
    data: interSemiBoldBuffer,
    weight: 600,
  };
}
