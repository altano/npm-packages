import { describe, expect, test } from "vitest";
import { getFont } from "./utils/getFont.js";
import { findLargestUsableFontSize } from "@altano/satori-fit-text";

describe("findLargestUsableFontSize", async () => {
  const font = await getFont();
  const lineHeight = 1;

  test("basic", async ({ bench }) => {
    await bench("basic", async () => {
      const fontSize = await findLargestUsableFontSize({
        text: `Hello I am the heading`,
        lineHeight,
        font,
        maxWidth: 300,
        maxHeight: 50,
      });
      expect(fontSize).toBe(28);
    }).run();
  });
});
