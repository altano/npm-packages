import { basicHtml } from "./../../astro-opengraph-image/tests/utils/basicHtml";
import { describe, expect } from "vitest";
import { middleware } from "./utils/makeTest";

describe("format", async () => {
  middleware.should("convert png", {
    requestUrl: `http://example.com/test.png`,
    format: "png",
    componentHtml: basicHtml,
    async testResponseFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/png");
    },
  });
});
