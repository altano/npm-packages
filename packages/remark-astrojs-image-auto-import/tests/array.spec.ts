import { describe, expect, it } from "vitest";
import { extract } from "../src/array";

describe("array", () => {
  describe("extract", () => {
    it("should extract one value", () => {
      const result = extract([1, 2, 3], (v): v is 2 => v === 2);
      expect(result).toMatchInlineSnapshot(`
        [
          2,
          [
            1,
            3,
          ],
        ]
      `);
    });
    it("should return null if not found", () => {
      const result = extract([1, 2, 3], (v): v is 5 => v === 5);
      expect(result).toMatchInlineSnapshot(`
        [
          null,
          [
            1,
            2,
            3,
          ],
        ]
      `);
    });
    it("should extract the first item", () => {
      const result = extract([1, 2, 3], (v): v is 1 => v === 1);
      expect(result).toMatchInlineSnapshot(`
        [
          1,
          [
            2,
            3,
          ],
        ]
      `);
    });
    it("should extract the last item", () => {
      const result = extract([1, 2, 3], (v): v is 3 => v === 3);
      expect(result).toMatchInlineSnapshot(`
        [
          3,
          [
            1,
            2,
          ],
        ]
      `);
    });
  });
});
