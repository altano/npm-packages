import { describe, expect, it } from "vitest";
import "../../../../src/matchers/setup";

const getResponse = (status: number): Response =>
  new Response("", {
    status,
  });

describe("toHaveStatus", () => {
  const status200 = getResponse(200);
  const status404 = getResponse(404);

  it("should pass when the status is correct", async () => {
    expect(status200).toHaveStatus(200);
    expect(status404).toHaveStatus(404);
  });
  it("should pass when the status is incorrect", async () => {
    expect(status200).not.toHaveStatus(500);
    expect(status404).not.toHaveStatus(500);
  });
  it("should error when the value should not match but does", async () => {
    expect(() =>
      expect(status200).not.toHaveStatus(200),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Status should not be expected value]`,
    );
  });
  it("should error when the value should match but doesn't", async () => {
    expect(() =>
      expect(status200).toHaveStatus(500),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Status is not expected value]`,
    );
  });
  it("should error when a non-Response is passed in", async () => {
    expect(() =>
      expect(1234).toHaveStatus(3),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Status is not expected value]`,
    );
  });
});
