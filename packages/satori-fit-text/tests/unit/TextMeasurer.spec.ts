import { describe, it, expect } from "vitest";
import { getTextMeasurer } from "../../src/TextMeasurer/getTextMeasurer";
import { getFont } from "./utils/getFont";

describe("getTextMeasurer", () => {
  describe(".doesSizeFit", () => {
    it("returns false when font is too large", async () => {
      const font = await getFont();
      const tm = await getTextMeasurer("face", font, 100, 100, 1);
      expect(await tm.doesSizeFit(100)).toEqual(false);
    });

    it("returns true when font is small enough", async () => {
      const font = await getFont();
      const tm = await getTextMeasurer("face", font, 100, 100, 1);
      expect(await tm.doesSizeFit(10)).toEqual(true);
    });
  });
});
