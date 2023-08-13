import { describe, expect } from "vitest";
import { middleware } from "./utils/makeTest";

describe("sharpOptions", async () => {
  const basicHtml = `
    <html>
      <body style="background-color: white; width: 100vw; height: 100vh;">
        <h1 style="font-size: 3.5rem; margin: 0;">I'm text in varying qualities</h1>
      </body>
    </html>
  `.trim();

  middleware.should("allow quality:100", {
    requestUrl: `http://example.com/high-quality.png`,
    format: "png",
    extraSatoriOptions: {
      width: 300,
      height: 300,
    },
    extraMiddlewareOptions: {
      async getSharpOptions() {
        return {
          quality: 100,
        };
      },
    },
    snapshot: true,
    componentHtml: basicHtml,
    async testFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/png");
    },
  });

  middleware.should("allow quality:1", {
    requestUrl: `http://example.com/low-quality.png`,
    format: "png",
    extraSatoriOptions: {
      width: 300,
      height: 300,
    },
    extraMiddlewareOptions: {
      async getSharpOptions() {
        return {
          effort: 1,
          compressionLevel: 9,
          colors: 2,
          quality: 1,
        };
      },
    },
    snapshot: true,
    componentHtml: basicHtml,
    async testFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/png");
    },
  });
});
