import { describe, expect } from "vitest";
import { middleware } from "./utils/makeTest.js";
import { basicHtml } from "./utils/basicHtml.js";

describe("dimensions", async () => {
  middleware.should("default to 1200x630", {
    requestUrl: `http://example.com/opengraph-image.png`,
    format: "png",
    componentHtml: basicHtml,
    async testResponseFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/png");
    },
  });
  middleware.should("allow custom dimensions", {
    requestUrl: `http://example.com/opengraph-image.png`,
    format: "png",
    extraSvgOptions: {
      width: 300,
      height: 500,
    },
    componentHtml: basicHtml,
    async testResponseFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/png");
    },
  });
});
