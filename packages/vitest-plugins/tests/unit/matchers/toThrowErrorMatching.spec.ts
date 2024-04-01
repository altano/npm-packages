import { describe, expect, it } from "vitest";
import "../../../src/matchers/setup";

describe("matchers", () => {
  describe("toThrowErrorMatching", () => {
    it("should match an error exactly", () => {
      expect(() => {
        throw new Error("face");
      }).toThrow("fac");
    });
    it("should NOT match an just the message", () => {
      expect(() => {
        throw new Error("face");
      }).not.toThrowErrorMatching("face");
    });
    it("should NOT match an invalid message", () => {
      expect(() => {
        throw new Error("face");
      }).not.toThrowErrorMatching(
        expect.objectContaining({
          message: "hat",
        }),
      );
    });
    it("should throw an error when an error wasn't thrown", () => {
      expect(() => {
        expect(() => 1).toThrowErrorMatching("face");
      }).toThrowErrorMatchingInlineSnapshot(`[Error: Did not throw an Error]`);
    });
  });
});
