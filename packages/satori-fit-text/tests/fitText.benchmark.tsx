import { describe, expect, bench } from "vitest";
import { getFont } from "./utils/getFont";
import { findLargestUsableFontSize } from "../src";

describe("findLargestUsableFontSize", () => {
  describe("performance", async () => {
    const font = await getFont();
    const lineHeight = 1;

    bench(
      "basic",
      async () => {
        const fontSize = await findLargestUsableFontSize({
          text: `Hello I am the heading`,
          lineHeight,
          font,
          maxWidth: 300,
          maxHeight: 50,
        });
        expect(fontSize).toBe(27);
      },
      {
        time: 1000,
      },
    );
  });
});
