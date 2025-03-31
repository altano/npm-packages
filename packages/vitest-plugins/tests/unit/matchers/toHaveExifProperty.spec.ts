import { describe, expect, it } from "vitest";
import "../../../src/matchers/setup";

describe("toHaveExifProperty", () => {
  const buffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2O4v3EyBwAGwgIsY3pRcwAAAABJRU5ErkJggg==",
    "base64url",
  );

  it("should pass when the property exists", async () => {
    await expect(buffer).toHaveExifProperty("ImageWidth");
  });
  it("should pass when the property doesn't exist", async () => {
    await expect(buffer).not.toHaveExifProperty("face");
  });
  it("should pass when the property value is correct", async () => {
    await expect(buffer).toHaveExifProperty("ImageHeight", 1);
    await expect(buffer).toHaveExifProperty("ImageWidth", 1);
  });
  it("should pass when the property value is incorrect", async () => {
    await expect(buffer).not.toHaveExifProperty("ImageWidth", 15);
    await expect(buffer).not.toHaveExifProperty("face", 15);
  });
  it("should error when the property should not exist but does", async () => {
    await expect(async () =>
      expect(buffer).not.toHaveExifProperty("ImageWidth"),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Received should not have the property "ImageWidth"]`,
    );
  });
  it("should error when the property should exist but doesn't", async () => {
    await expect(async () =>
      expect(buffer).toHaveExifProperty("face"),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Received does not have the property "face"]`,
    );
  });
  it("should error when the value should not match but does", async () => {
    await expect(async () =>
      expect(buffer).not.toHaveExifProperty("ImageWidth", 1),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Property "ImageWidth" should not be expected value]`,
    );
  });
  it("should error when the value should match but doesn't", async () => {
    await expect(async () =>
      expect(buffer).toHaveExifProperty("ImageWidth", 17),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Property "ImageWidth" is not expected value]`,
    );
  });
  it("should error when a non-buffer is passed in", async () => {
    await expect(async () =>
      expect(1234).toHaveExifProperty("face"),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid input argument]`,
    );
  });
});
