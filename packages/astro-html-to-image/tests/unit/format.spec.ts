import { basicHtml } from "../../../astro-opengraph-image/tests/unit/utils/basicHtml.js";
import { describe, expect } from "vitest";
import { middleware } from "./utils/makeTest.js";

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
