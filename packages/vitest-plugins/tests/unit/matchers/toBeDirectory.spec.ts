import os from "node:os";
import { describe, expect, it } from "vitest";
import "../../../src/matchers/setup";

describe("matchers", () => {
  describe("toBeDirectory", () => {
    it("should recognize the root", () => {
      expect("/").toBeDirectory();
    });
    it("should recognize the home directory", () => {
      expect(os.homedir()).toBeDirectory();
    });
    it("should recognize this test's directory", () => {
      expect(import.meta.dirname).toBeDirectory();
    });
    it("should not match on garbage", () => {
      expect("fucking garbage").not.toBeDirectory();
    });
    it("should not match on a made up dir", () => {
      expect("/some/plausible/horseshit").not.toBeDirectory();
    });
    it("should NOT recognize this test file as a directory", () => {
      expect(import.meta.filename).not.toBeDirectory();
    });
    it("should throw an error when not a directory", () => {
      expect(() => {
        expect("face").toBeDirectory();
      }).toThrowErrorMatchingInlineSnapshot(
        `[Error: Received is not a directory (or cannot be accessed by the current user)]`,
      );
    });
  });
});
