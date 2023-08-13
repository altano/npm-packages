import { describe, expect } from "vitest";
import { middleware } from "./utils/makeTest";
import { APIContext } from "astro";

describe("shouldReplace", async () => {
  const basicHtml = `
    <html>
      <body style="background-color: white; width: 100vw; height: 100vh;">
        <h1 style="font-size: 3.5rem; margin: 0;">I'm text in varying qualities</h1>
      </body>
    </html>
  `.trim();

  middleware.should("ignore other mime types", {
    requestUrl: `http://example.com/test.png`,
    format: "png",
    snapshot: false,
    getComponentResponse: async () =>
      new Response(basicHtml, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      }),
    async testFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("text/plain");
      expect(response.headers.get("Content-Disposition")).toBeNull();
    },
  });

  middleware.should("not alter response of non-image requests", {
    requestUrl: `http://example.com/face/`,
    format: "png",
    snapshot: false,
    componentHtml: basicHtml,
    async testFn(response) {
      const body = await response.text();
      expect(body).toEqual(basicHtml);
      expect(response.headers.get("Content-Type")).toEqual("text/html");
      expect(response.headers.get("Content-Disposition")).toBeNull();
    },
  });

  middleware.should("NOT convert other image formats", {
    requestUrl: `http://example.com/test.png`,
    format: "jpg",
    componentHtml: basicHtml,
    snapshot: false,
    async testFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("text/html");
      expect(response.headers.get("Content-Disposition")).toBeNull();
    },
  });

  middleware.should("ignore trailing slash in request URL (for SSG)", {
    requestUrl: `http://example.com/test.png/`,
    format: "png",
    componentHtml: basicHtml,
    snapshot: false,
    async testFn(response) {
      expect(response.headers.get("Content-Type")).toEqual("image/png");
      expect(response.headers.get("Content-Disposition")).toBeDefined();
    },
  });

  describe("custom shouldReplace function", async () => {
    const extraMiddlewareOptions = {
      async shouldReplace(context: APIContext): Promise<boolean> {
        const url = context.url.toString();
        return url.endsWith("open-graph.png");
      },
    };

    middleware.should("that matches filename", {
      requestUrl: `http://example.com/open-graph.png`,
      format: "png",
      componentHtml: basicHtml,
      snapshot: false,
      extraMiddlewareOptions,
      async testFn(response) {
        expect(response.headers.get("Content-Type")).toEqual("image/png");
        expect(response.headers.get("Content-Disposition")).toBeDefined();
      },
    });

    middleware.should("that doesn't match filename", {
      requestUrl: `http://example.com/other.png`,
      format: "png",
      componentHtml: basicHtml,
      snapshot: false,
      extraMiddlewareOptions,
      async testFn(response) {
        expect(response.headers.get("Content-Type")).toEqual("text/html");
        expect(response.headers.get("Content-Disposition")).toBeNull();
      },
    });
  });
});
