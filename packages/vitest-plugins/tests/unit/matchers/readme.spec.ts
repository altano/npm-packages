import { describe, expect, it } from "vitest";
import "../../../src/matchers/setup";

describe("readme", () => {
  it("should describe toMatchError", () => {
    expect(new Error("face")).toMatchError(
      expect.objectContaining({
        stack: expect.stringContaining("readme.spec.ts") as unknown,
      }),
    );
  });
  it("should describe toThrowErrorMatching", () => {
    expect(() => {
      throw new Error("face");
    }).toThrowErrorMatching(
      expect.objectContaining({
        stack: expect.stringContaining("readme.spec.ts") as unknown,
      }),
    );
  });
});
