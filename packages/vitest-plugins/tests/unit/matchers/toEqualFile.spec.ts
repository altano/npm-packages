import { describe, expect, it } from "vitest";
import "../../../src/matchers/setup";
import path from "node:path";

describe("matchers", () => {
  describe("toEqualFile", () => {
    // Okay this is a silly test but *shrug*
    it("should produce a hash of this test file", () => {
      expect(import.meta.filename).toEqualFile(import.meta.filename);
    });
    it("should fail when given two differing files", async () => {
      expect(() => {
        expect(import.meta.filename).toEqualFile(
          path.join(import.meta.dirname, "toBePath.spec.ts"),
        );
      }).toThrowErrorMatchingInlineSnapshot(
        `[Error: The checksum of the file contents of the files do not match]`,
      );
    });
    it("should fail when given a non-existent file", async () => {
      expect(() => {
        expect("faaaaaaaaaace").toEqualFile("khaaaaaaaaan");
      }).toThrowErrorMatchingInlineSnapshot(
        `[Error: ENOENT: no such file or directory, open 'faaaaaaaaaace']`,
      );
    });
  });
});
