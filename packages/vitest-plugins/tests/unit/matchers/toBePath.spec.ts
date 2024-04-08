import path from "node:path";
import { describe, expect, it } from "vitest";
import "../../../src/matchers/setup";

describe("matchers", () => {
  describe("toBePath", () => {
    it("should recognize this test file as a file", () => {
      const weirdPath = path.join(
        import.meta.dirname,
        "..",
        path.basename(import.meta.dirname),
      );
      expect(import.meta.dirname).toBePath(weirdPath);
    });
    it("should throw an error for a non-matching path", () => {
      const wrongPath = path.join(import.meta.dirname, "..");
      expect(() => {
        expect(import.meta.dirname).toBePath(wrongPath);
      }).toThrowErrorMatchingInlineSnapshot(`[Error: The realpath of the received path did not match the expected one]`);
    });
    it("should throw an error for a path that isn't accessible", () => {
      const nonExistentPath = path.join(import.meta.dirname, "face");
      expect(() => {
        expect(import.meta.dirname).toBePath(nonExistentPath);
      }).toThrowErrorMatchingInlineSnapshot(
        `[Error: One of the paths wasn't an accessible file on disk and couldn't be compared]`,
      );
    });
  });
});
