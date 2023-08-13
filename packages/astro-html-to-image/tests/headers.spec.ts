import { describe, expect } from "vitest";
import { middleware } from "./utils/makeTest";

describe("headers", async () => {
  const basicHtml = `
    <html>
      <body style="background-color: white; width: 100vw; height: 100vh;">
        <h1>Sup!</h1>
      </body>
    </html>
  `.trim();

  middleware.should("return correct header values", {
    requestUrl: `http://example.com/face.png`,
    format: "png",
    extraSatoriOptions: {
      width: 300,
      height: 300,
    },
    snapshot: false,
    componentHtml: basicHtml,
    async testFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/png");
      expect(response.headers.get("Content-Disposition")).toEqual(
        `inline; filename="face.png"`,
      );
    },
  });
});
