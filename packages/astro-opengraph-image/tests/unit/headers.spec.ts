import { describe, expect } from "vitest";
import { middleware } from "./utils/makeTest.js";
import { basicHtml } from "./utils/basicHtml.js";

describe("headers", async () => {
  middleware.should("return correct header values", {
    requestUrl: `http://example.com/opengraph-image.png`,
    format: "png",
    snapshot: false,
    componentHtml: basicHtml,
    async testResponseFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/png");
      expect(response.headers.get("Content-Disposition")).toEqual(
        `inline; filename="opengraph-image.png"`,
      );
    },
  });
});
