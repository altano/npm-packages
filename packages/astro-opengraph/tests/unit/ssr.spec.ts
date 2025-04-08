import { beforeAll, describe, expect, it } from "vitest";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import {
  loadFixture,
  type TestApp,
} from "@inox-tools/astro-tests/astroFixture";
import testAdapter from "@inox-tools/astro-tests/testAdapter";

expect.extend({ toMatchImageSnapshot });

describe("SSR fetch files", async () => {
  let app: TestApp;

  beforeAll(async () => {
    const fixture = await loadFixture({
      root: "../fixtures/ssr/",
      output: "server",
      adapter: testAdapter(),
    });
    await fixture.build({});
    app = await fixture.loadTestAdapterApp();
  });

  it("index.astro page should have unmodified contents", async () => {
    const response = await app.render(
      new Request(new URL("https://example.com")),
    );
    expect(response).toHaveStatus(200);
    const indexAstroContents = await response.text();
    expect(indexAstroContents).toMatchInlineSnapshot(
      `
        "<!-- Formatted HTML -->
        <!doctype html>
        <html>
          <head>
            <meta property="og:image" content="https://example.com/opengraph.png" />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <title>Basic Example</title>
          </head>
          <body>
            <h1>A Heading</h1>
            <p>Hello!</p>
          </body>
        </html>"
      `,
    );
  });

  it("about.json.ts endpoint should have unmodified contents", async () => {
    const response = await app.render(
      new Request(new URL("https://example.com/about.json")),
    );
    expect(response).toHaveStatus(200);
    const aboutJson = (await response.json()) as unknown;
    expect(aboutJson).toBeTruthy();
    expect(aboutJson).toBeTypeOf("object");
    expect(aboutJson).toHaveProperty("name", "Astro");
    expect(aboutJson).toHaveProperty("url", "https://astro.build/");
  });

  it("root opengraph.png should be an image", async () => {
    const response = await app.render(
      new Request(new URL("https://example.com/opengraph.png")),
    );
    expect(response).toHaveStatus(200);
    const imageArrayBuffer = await response.arrayBuffer();
    expect(imageArrayBuffer).toBeTruthy();
    const imageBuffer = Buffer.from(imageArrayBuffer);
    expect(imageBuffer).toMatchImageSnapshot();
  });

  it("root opengraph.png should have the correct headers", async () => {
    const response = await app.render(
      new Request(new URL("https://example.com/opengraph.png")),
    );
    expect(response).toHaveHeader("Content-Type", "image/png");
  });

  it("nested opengraph.png with a static path should be an image", async () => {
    const response = await app.render(
      new Request(
        new URL("https://example.com/blog/hard-coded-article/opengraph.png"),
      ),
    );
    expect(response).toHaveStatus(200);
    expect(response).toHaveHeader("Content-Type", "image/png");
    const imageArrayBuffer = await response.arrayBuffer();
    expect(imageArrayBuffer).toBeTruthy();
    const imageBuffer = Buffer.from(imageArrayBuffer);
    expect(imageBuffer).toMatchImageSnapshot();
  });

  it("should allow customizing the endpoint content type", async () => {
    const response = await app.render(
      new Request(new URL("https://example.com/custom-content-type/face.png")),
    );
    expect(response).toHaveStatus(200);
    expect(response).toHaveHeader("Content-Type", "content-facetype");
  });

  it("should allow customizing the component props", async () => {
    const response = await app.render(
      new Request(new URL("https://example.com/component-uses/custom-props")),
    );
    expect(response).toHaveStatus(200);
    // expect(response).toHaveHeader("Content-Type", "image/facecontenttype");
    const html = await response.text();
    expect(html).toBeTruthy();
    expect(html).toContain(
      `<meta property="og:image:type" content="image/facemime">`,
    );
  });
});
