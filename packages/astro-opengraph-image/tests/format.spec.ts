import { describe, expect } from "vitest";
import { middleware } from "./utils/makeTest";
import { basicHtml } from "./utils/basicHtml";

describe("format", async () => {
  middleware.should("convert png", {
    requestUrl: `http://example.com/opengraph-image.png`,
    format: "png",
    componentHtml: basicHtml,
    snapshot: false,
    async testFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/png");
    },
  });

  middleware.should("convert jpg", {
    requestUrl: `http://example.com/opengraph-image.jpg`,
    format: "jpg",
    componentHtml: basicHtml,
    snapshot: false, // jest-image-snapshot does not support jpeg
    async testFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/jpeg");
    },
  });
});
