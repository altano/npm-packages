import { describe, expect } from "vitest";
import { middleware } from "./utils/makeTest";

describe("svgOptions", async () => {
  const basicHtml = (content: string, background = ""): string =>
    `
    <html>
      <body style="${background} width: 100vw; height: 100vh;">
        <h1 style="font-size: 3.5rem; margin: 0;">${content}</h1>
      </body>
    </html>
  `.trim();

  middleware.should("optimize for speed", {
    requestUrl: `http://example.com/optimize-speed.png`,
    format: "png",
    extraSvgOptions: {
      width: 300,
      height: 300,
    },
    extraMiddlewareOptions: {
      async getImageOptions() {
        return {
          shapeRendering: 0,
          textRendering: 0,
          imageRendering: 1,
        };
      },
    },
    snapshot: true,
    componentHtml: basicHtml(`I was generated for speed`),
    async testFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/png");
    },
  });

  middleware.should("optimize for quality", {
    requestUrl: `http://example.com/optimize-quality.png`,
    format: "png",
    extraSvgOptions: {
      width: 300,
      height: 300,
    },
    extraMiddlewareOptions: {
      async getImageOptions() {
        return {
          shapeRendering: 2,
          textRendering: 1,
          imageRendering: 1,
        };
      },
    },
    snapshot: true,
    componentHtml: basicHtml(`I was generated for quality`),
    async testFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/png");
    },
  });

  middleware.should("custom background", {
    requestUrl: `http://example.com/background-fuchsia.png`,
    format: "png",
    extraSvgOptions: {
      width: 300,
      height: 300,
    },
    extraMiddlewareOptions: {
      async getImageOptions() {
        return {
          background: "rgba(255,0,255, 0.8)",
        };
      },
    },
    snapshot: true,
    componentHtml: basicHtml(`I have a fuchsia background`),
    async testFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/png");
    },
  });

  middleware.should("background from html/css", {
    requestUrl: `http://example.com/background-html.png`,
    format: "png",
    extraSvgOptions: {
      width: 300,
      height: 300,
    },
    snapshot: true,
    componentHtml: basicHtml(
      `I have a white background`,
      "background-color: white;",
    ),
    async testFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/png");
    },
  });
});
