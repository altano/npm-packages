import { describe, expect } from "vitest";
import { middleware } from "./utils/makeTest";

describe("createHtmlToImageMiddleware", async () => {
  middleware.should("have correct header values", {
    requestUrl: `http://example.com/face.png`,
    format: "png",
    extraSatoriOptions: {
      width: 300,
      height: 300,
    },
    snapshot: false,
    getComponentResponse: async () =>
      new Response(
        `
        <html>
          <body style="background-color: white">
            <h1>Sup!</h1>
          </body>
        </html>`,
        {
          status: 200,
          headers: {
            "Content-Type": "text/html",
          },
        },
      ),
    testFn: async (response) => {
      expect(response.headers.get("Content-Type")).toEqual("image/png");
      expect(response.headers.get("Content-Disposition")).toEqual(
        `inline; filename="face.png"`,
      );
    },
  });
});
