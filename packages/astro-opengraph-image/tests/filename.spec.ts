import { describe, expect } from "vitest";
import { middleware } from "./utils/makeTest";
import { basicHtml } from "./utils/basicHtml";

describe("filename", async () => {
  middleware.should("convert opengraph-image.png", {
    requestUrl: `http://example.com/opengraph-image.png`,
    format: "png",
    snapshot: false,
    componentHtml: basicHtml,
    async testFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/png");
    },
  });

  middleware.should("NOT convert test.png", {
    requestUrl: `http://example.com/test.png`,
    format: "png",
    snapshot: false,
    componentHtml: basicHtml,
    async testFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("text/html");
      expect(response.headers.get("Content-Disposition")).toBeNull();
    },
  });
});
