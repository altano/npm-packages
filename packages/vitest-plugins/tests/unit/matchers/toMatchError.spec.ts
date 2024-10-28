import { describe, expect, it } from "vitest";
import "../../../src/matchers/setup";

describe("matchers", () => {
  describe("toMatchError", () => {
    it("should match an error exactly", () => {
      expect(new Error("face")).toMatchError(
        expect.objectContaining({
          message: "face",
          name: "Error",
          stack: expect.any(String) as unknown,
        }),
      );
    });
    it("should match an error by substring", () => {
      expect(new Error("your stupid face")).toMatchError(
        expect.objectContaining({
          message: expect.stringContaining("stupid") as unknown,
        }),
      );
    });
    it("should NOT match an invalid string", () => {
      expect(new Error("face")).not.toMatchError(
        expect.objectContaining({
          message: "hat",
        }),
      );
    });
    it("should throw an error when there is no match", () => {
      expect(() => {
        expect(new Error("face")).toMatchError(
          expect.objectContaining({
            message: "hat",
          }),
        );
      }).toThrowErrorMatchingInlineSnapshot(
        `[Error: Expected errors to match]`,
      );
    });
    it.todo("should display the other Error fields in the error", () => {
      // I don't know how to capture vitest's full error output to verify it
      // contains what we expect.
    });
  });
});
