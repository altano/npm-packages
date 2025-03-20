import { describe, expect, it } from "vitest";

import urlSerializer from "../../../src/serializers/url.js";
expect.addSnapshotSerializer(urlSerializer);

describe("serializers", () => {
  describe("url", () => {
    it("should remove the port in a localhost http[s] url", () => {
      expect(
        `String with http://localhost:1234/path/to/face url`,
      ).toMatchInlineSnapshot(`"String with http://localhost/path/to/face url"`);
    });
  });
});
