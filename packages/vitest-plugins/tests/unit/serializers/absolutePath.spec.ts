import { describe, expect, it } from "vitest";

import absolutePathSerializer from "../../../src/serializers/absolutePath.js";
expect.addSnapshotSerializer(absolutePathSerializer);

describe("serializers", () => {
  describe("absolutePath", () => {
    it("should remove absolute file paths in a string", () => {
      expect(
        `String with an absolute path: ${import.meta.dirname}`,
      ).toMatchInlineSnapshot(
        `"String with an absolute path: <cwd>/tests/unit/serializers"`,
      );
    });
  });
});
