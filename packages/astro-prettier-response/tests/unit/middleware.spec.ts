import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { onRequest } from "../../src/middleware/index.js";
import { createContext } from "astro/middleware";
import type { APIContext, MiddlewareNext } from "astro";
import { loggerWithSpy } from "./utils/setup.js";

const [mockConfig, setConfig] = await vi.hoisted(async () => {
  const { ConfigSchema } = await import("../../src/config.js");
  const mockConfig = {
    get default() {
      // Use default config
      return ConfigSchema.parse({});
    },
  };
  const spy = vi.spyOn(mockConfig, "default", "get");
  function setConfig(config: Partial<typeof mockConfig.default>): void {
    spy.mockReturnValue(ConfigSchema.parse(config));
  }
  return [mockConfig, setConfig];
});

vi.mock("virtual:astro-prettier-response/config", () => {
  return mockConfig;
});

const urlToContext = (url: string): APIContext =>
  createContext({
    request: new Request(url),
    defaultLocale: "en",
    locals: [],
  });

const defaultContext = createContext({
  request: new Request("http://face.com"),
  defaultLocale: "en",
  locals: [],
});

const html = (markup: string) => () =>
  Promise.resolve(
    new Response(markup, { headers: { "Content-Type": "text/html" } }),
  );

const nextError: MiddlewareNext = async () =>
  new Response("i error", {
    status: 503,
  });

const nextImage: MiddlewareNext = async () =>
  new Response(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2O4v3EyBwAGwgIsY3pRcwAAAABJRU5ErkJggg==",
    {
      headers: { "Content-Type": "image/png" },
    },
  );

const nextUnknown: MiddlewareNext = async () =>
  new Response("hi", {
    headers: { "Content-Type": "something-made-up/lol" },
  });

const nextMalformedJSON: MiddlewareNext = async () =>
  new Response("123 >>> 8888 face", {
    headers: { "Content-Type": "application/json" },
  });

const next404Html: MiddlewareNext = async () =>
  new Response("<html><body>404 can't find this</body></html>", {
    status: 404,
    headers: { "Content-Type": "text/html" },
  });

describe("middleware", async () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should skip errors", async () => {
    const response = await onRequest(defaultContext, nextError);
    expect(response?.status).toBe(503);
    await expect(response?.text()).resolves.toBe("i error");
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(loggerWithSpy.debug).toHaveBeenCalledWith(
      expect.stringContaining("status is not 2xx"),
    );
  });

  it("should skip images", async () => {
    const response = await onRequest(defaultContext, nextImage);
    expect(response?.status).toBe(200);
    await expect(response?.text?.()).resolves.toBe(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2O4v3EyBwAGwgIsY3pRcwAAAABJRU5ErkJggg==",
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(loggerWithSpy.debug).toHaveBeenCalledWith(
      expect.stringContaining("Prettier has no parser for this file type"),
    );
  });

  it("should get the filename from the url", async () => {
    const response = await onRequest(
      urlToContext("http://face.com/face.html"),
      html(`<html><body>hi</body></html>`),
    );
    expect(response?.status).toBe(200);
    await expect(response?.text?.()).resolves.toMatchInlineSnapshot(`
      "<html>
        <body>
          hi
        </body>
      </html>
      "
    `);
  });

  it("should not get the filename from the url", async () => {
    const response = await onRequest(
      urlToContext("http://face.com"),
      html(`<html><body>hi</body></html>`),
    );
    expect(response?.status).toBe(200);
    await expect(response?.text?.()).resolves.toMatchInlineSnapshot(`
      "<html>
        <body>
          hi
        </body>
      </html>
      "
    `);
  });

  it("should format a 404 html page with a defined content type", async () => {
    const response = await onRequest(defaultContext, next404Html);
    expect(response?.status).toBe(404);
    await expect(response?.text?.()).resolves.toMatchInlineSnapshot(`
      "<html>
        <body>
          404 can't find this
        </body>
      </html>
      "
    `);
  });

  it("should ignore an unknown content-type", async () => {
    const response = await onRequest(defaultContext, nextUnknown);
    expect(response?.status).toBe(200);
    await expect(response?.text?.()).resolves.toMatchInlineSnapshot(`"hi"`);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(loggerWithSpy.debug).toHaveBeenCalledWith(
      expect.stringContaining("couldn't determine filename"),
    );
  });

  it("should gracefully handle malformed JSON", async () => {
    const response = await onRequest(defaultContext, nextMalformedJSON);
    expect(response?.status).toBe(200);
    await expect(response?.text?.()).resolves.toMatchInlineSnapshot(
      `"123 >>> 8888 face"`,
    );
  });

  it("should remove blank lines", async () => {
    const response = await onRequest(
      defaultContext,
      async () =>
        new Response(
          `
      <html>
        <head>

  <title>hi</title>

        </head>
        <body>hi</body>
      </html>
  `,
          { headers: { "Content-Type": "text/html" } },
        ),
    );
    expect(response?.status).toBe(200);
    await expect(response?.text?.()).resolves.toMatchInlineSnapshot(`
      "<html>
        <head>
          <title>hi</title>
        </head>
        <body>
          hi
        </body>
      </html>
      "
    `);
  });

  it("should format markdown", async () => {
    const response = await onRequest(
      urlToContext("http://face.com/readme.md"),
      async () =>
        new Response(
          `## Hi
I'm some markdown.

\`\`\`js
  function whatsup() { console.log('hi') }
  \`\`\`
1. whatever
2. whatever`,
          {
            headers: { "Content-Type": "text/markdown" },
          },
        ),
    );
    expect(response?.status).toBe(200);
    await expect(response?.text?.()).resolves.toMatchInlineSnapshot(`
      "## Hi

      I'm some markdown.

      \`\`\`js
      function whatsup() {
        console.log("hi");
      }
      \`\`\`

      1. whatever
      2. whatever
      "
    `);
  });

  it("should only debug log it was successful in logs", async () => {
    const response = await onRequest(
      defaultContext,
      html(`<html><body>hi</body></html>`),
    );
    expect(response?.status).toBe(200);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(loggerWithSpy.debug).toHaveBeenCalledWith(
      expect.stringContaining("successfully formatted"),
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(loggerWithSpy.info).not.toHaveBeenCalledWith(
      expect.stringContaining("successfully formatted"),
    );
  });

  it("should log errors for formatable responses with not-formatable bodies", async () => {
    const response = await onRequest(defaultContext, nextMalformedJSON);
    expect(response?.status).toBe(200);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(loggerWithSpy.error).toHaveBeenCalledWith("failed to format");
  });

  it("formats a span as block given the html directive", async () => {
    const response = await onRequest(
      urlToContext("http://face.com/face.html"),
      html(`
        <!-- display: block -->
        <span class="dolorum atque aspernatur">Est molestiae sunt facilis qui rem.</span>
    `),
    );
    expect(response?.status).toBe(200);
    await expect(response?.text?.()).resolves.toMatchInlineSnapshot(`
      "<!-- display: block -->
      <span class="dolorum atque aspernatur">
        Est molestiae sunt facilis qui rem.
      </span>
      "
    `);
  });

  it("formats a span as inline without any directives", async () => {
    const response = await onRequest(
      urlToContext("http://face.com/face.html"),
      html(
        `<span class="dolorum atque aspernatur">Est molestiae sunt facilis qui rem.</span>`,
      ),
    );
    expect(response?.status).toBe(200);
    await expect(response?.text?.()).resolves.toMatchInlineSnapshot(`
      "<span class="dolorum atque aspernatur"
        >Est molestiae sunt facilis qui rem.</span
      >
      "
    `);
  });

  describe("xml plugin", () => {
    const nextXml: MiddlewareNext = async () =>
      new Response(
        `<?xml version="1.0" encoding="UTF-8"?><note><
        to>Tove</to
        >
    <from >Jani</from><selfclosing/>
    <heading>Reminder</heading>
    <body>Don't forget me this weekend!</body>
    </note>`,
        {
          headers: { "Content-Type": "application/xml" },
        },
      );

    beforeEach(() => {
      setConfig({
        formatXml: true,
      });
    });

    it("should format xml", async () => {
      const response = await onRequest(defaultContext, nextXml);
      expect(response?.status).toBe(200);
      await expect(response?.text()).resolves.toMatchInlineSnapshot(`
        "<?xml version="1.0" encoding="UTF-8" ?>
        <note><to>Tove</to>
            <from>Jani</from><selfclosing />
            <heading>Reminder</heading>
            <body>Don't forget me this weekend!</body>
            </note>
        "
      `);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(loggerWithSpy.debug).toHaveBeenCalledWith(
        "successfully formatted",
      );
    });
  });
});
