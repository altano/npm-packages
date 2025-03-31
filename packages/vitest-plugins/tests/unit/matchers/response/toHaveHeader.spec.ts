import { describe, expect, it } from "vitest";
import "../../../../src/matchers/setup";

describe("toHaveHeader", () => {
  const r = new Response("", {
    headers: {
      "Content-Type": "image/png",
    },
  });

  it("should pass when the property exists", async () => {
    expect(r).toHaveHeader("Content-Type");
  });
  it("should pass when the property doesn't exist", async () => {
    expect(r).not.toHaveHeader("face");
  });
  it("should pass when the property value is correct", async () => {
    expect(r).toHaveHeader("Content-Type", "image/png");
  });
  it("should pass when the property value is incorrect", async () => {
    expect(r).not.toHaveHeader("Content-Type", 15);
    expect(r).not.toHaveHeader("face", 15);
  });
  it("should error when the property should not exist but does", async () => {
    expect(() =>
      expect(r).not.toHaveHeader("Content-Type"),
    ).toThrowErrorMatchingInlineSnapshot(`[Error: Received should not have the header "Content-Type"]`);
  });
  it("should error when the property should exist but doesn't", async () => {
    expect(() =>
      expect(r).toHaveHeader("face"),
    ).toThrowErrorMatchingInlineSnapshot(`[Error: Received does not have the header "face"]`);
  });
  it("should error when the value should not match but does", async () => {
    expect(() =>
      expect(r).not.toHaveHeader("Content-Type", "image/png"),
    ).toThrowErrorMatchingInlineSnapshot(`[Error: Header "Content-Type" should not be expected value]`);
  });
  it("should error when the value should match but doesn't", async () => {
    expect(() =>
      expect(r).toHaveHeader("Content-Type", 17),
    ).toThrowErrorMatchingInlineSnapshot(`[Error: Header "Content-Type" is not expected value]`);
  });
  it("should error when a non-buffer is passed in", async () => {
    expect(() =>
      expect(1234).toHaveHeader("face"),
    ).toThrowErrorMatchingInlineSnapshot(`[TypeError: Cannot read properties of undefined (reading 'has')]`);
  });
});
