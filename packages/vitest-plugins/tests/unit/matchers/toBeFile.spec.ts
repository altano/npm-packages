import { describe, expect, it } from "vitest";
import "../../../src/matchers/setup";

describe("matchers", () => {
  describe("toBeFile", () => {
    it("should recognize this test file as a file", () => {
      expect(import.meta.filename).toBeFile();
    });
    it("should NOT recognize this test directory as a file", () => {
      expect(import.meta.dirname).not.toBeFile();
    });
    it("should throw an error when not a file", () => {
      expect(() => {
        expect("face").toBeFile();
      }).toThrowErrorMatchingInlineSnapshot(
        `[Error: face is not a file (or cannot be accessed by the current user)]`,
      );
    });
  });
});
