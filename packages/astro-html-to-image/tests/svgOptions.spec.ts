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
    async testResponseFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/png");
    },
  });
});
