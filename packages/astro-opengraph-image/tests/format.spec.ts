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
});
