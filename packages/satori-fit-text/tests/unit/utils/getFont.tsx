import { getInterBuffer } from "@altano/assets";
import type { Font } from "../../../src/types";

export async function getFont(weight: Font["weight"] = 600): Promise<Font> {
  const interBuffer = await getInterBuffer(weight);
  return {
    name: "Inter",
    data: interBuffer,
    weight: weight,
  };
}
