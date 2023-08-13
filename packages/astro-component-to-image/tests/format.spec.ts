import { describe, expect } from "vitest";
import { middleware } from "./utils/makeTest";

describe("format", async () => {
  const basicHtml = `
    <html>
      <body style="background-color: white; width: 100vw; height: 100vh;">
        <h1 style="font-size: 3.5rem; margin: 0;">Why hello there.</h1>
      </body>
    </html>
  `.trim();

  middleware.should("convert png", {
    requestUrl: `http://example.com/test.png`,
    format: "png",
    componentHtml: basicHtml,
    async testFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/png");
    },
  });

  middleware.should("convert jpg", {
    requestUrl: `http://example.com/test.jpg`,
    format: "jpg",
    componentHtml: basicHtml,
    snapshot: false, // jest-image-snapshot does not support jpeg
    async testFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/jpeg");
    },
  });
});
