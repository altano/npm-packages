import { beforeAll, afterAll, describe, expect, it } from "vitest";
import {
  loadFixture,
  type DevServer,
  type TestApp,
} from "@inox-tools/astro-tests/astroFixture";
import type { Fixture } from "./utils/types.js";
import testAdapter from "@inox-tools/astro-tests/testAdapter";
import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

describe("Opengraph Routes", () => {
  describe("SSG", async () => {
    let fixture: Fixture;

    beforeAll(async () => {
      fixture = await loadFixture({
        root: "./fixtures/basic/",
        output: "static",
      });
      await fixture.build({});
    });

    it("index.astro page should have unmodified contents", async () => {
      const contents = await fixture.readFile("/index.html");
      expect(contents).toBeTruthy();
      expect(contents).toMatchInlineSnapshot(
        `
        "<!-- Formatted HTML -->
        <!doctype html>
        <html>
          <head>
            <meta property="og:image" content="http://localhost/opengraph.png" />
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
      const contents = await fixture.readFile("/about.json");
      expect(contents).toBeTruthy();
      const aboutJson = JSON.parse(contents!) as unknown;
      expect(aboutJson).toBeTruthy();
      expect(aboutJson).toBeTypeOf("object");
      expect(aboutJson).toHaveProperty("name", "Astro");
      expect(aboutJson).toHaveProperty("url", "https://astro.build/");
    });

    it("root opengraph.png endpoint should have image", async () => {
      const image = await fixture.readFileAsBuffer("/opengraph.png");
      expect(image).toBeTruthy();
      expect(image).toMatchImageSnapshot();
    });

    it("if not specified, there should be no opengraph image", async () => {
      expect(fixture.pathExists("/no-opengraph/opengraph.png")).toStrictEqual(
        false,
      );
    });

    it("should let the endpoint use the root template", async () => {
      const image = await fixture.readFileAsBuffer(
        "/root-from-endpoint/opengraph.png",
      );
      expect(image).toBeTruthy();
      expect(image).toMatchImageSnapshot();
    });

    it("should let the component use the root opengraph image", async () => {
      const contents = await fixture.readFile(
        "/root-from-component/index.html",
      );
      expect(contents).toBeTruthy();
      expect(contents).toMatch(
        new RegExp(
          String.raw`<meta property="og:image" content="http://.*/opengraph.png">`,
        ),
      );
    });

    it("nested opengraph.png with a static path endpoint should have image", async () => {
      const image = await fixture.readFileAsBuffer(
        "/blog/hard-coded-article/opengraph.png",
      );
      expect(image).toBeTruthy();
      expect(image).toMatchImageSnapshot();
    });

    it("nested opengraph.png with dynamic path and getStaticPaths should have an opengraph image", async () => {
      const image = await fixture.readFileAsBuffer(
        "/blog/hello-world/opengraph.png",
      );
      expect(image).toBeTruthy();
      expect(image).toMatchImageSnapshot();
    });

    it("opengraph image dimensions should default to 1200x630", async () => {
      const image = await fixture.readFileAsBuffer("/opengraph.png");
      await expect(image).toHaveExifProperty("ImageWidth", 1200);
      await expect(image).toHaveExifProperty("ImageHeight", 630);
    });

    it("should not have html from dev route in ssg", async () => {
      expect(fixture.pathExists("/opengraph.html")).toStrictEqual(false);
    });

    describe("Component", () => {
      it("should have a default", async () => {
        const html = await fixture.readFile(
          "/component-uses/default/index.html",
        );
        expect(html).toBeTruthy();
        expect(html).toMatch(
          new RegExp(
            String.raw`<meta property="og:image" content="http://.*/component-uses/default/opengraph.png">`,
          ),
        );
        expect(html).toContain(
          `<meta property="og:image:type" content="image/png">`,
        );
        expect(html).toContain(
          `<meta property="og:image:width" content="1200">`,
        );
        expect(html).toContain(
          `<meta property="og:image:height" content="630">`,
        );
        expect(html).not.toContain(`og:image:title`);
        expect(html).not.toContain(`og:image:description`);
      });

      it("should allow customizing the component props", async () => {
        const html = await fixture.readFile(
          "/component-uses/custom-props/index.html",
        );
        expect(html).toBeTruthy();
        expect(html).toMatch(
          new RegExp(
            String.raw`<meta property="og:image" content="http://.*/component-uses/custom-props/face.png">`,
          ),
        );
        expect(html).toContain(
          `<meta property="og:image:type" content="image/png">`,
        );
        expect(html).toContain(
          `<meta property="og:image:width" content="101">`,
        );
        expect(html).toContain(
          `<meta property="og:image:height" content="901">`,
        );
        expect(html).toContain(
          `<meta property="og:title" content="I'm a computer">`,
        );
        expect(html).toContain(
          `<meta property="og:description" content="stop all the downloadin">`,
        );
      });
    });
  });

  describe("DEV", async () => {
    let fixture: Fixture;
    let devServer: DevServer;

    beforeAll(async () => {
      fixture = await loadFixture({
        root: "./fixtures/basic/",
        output: "server",
      });
      devServer = await fixture.startDevServer({});
    });

    afterAll(async () => {
      await devServer.stop();
    });

    it("root should have an explicit dev html route (for html debuggability)", async () => {
      // console.log(`glob = `, await fixture.glob("*"));
      const response = await fixture.fetch("/opengraph.html");
      expect(response).toHaveProperty("status", 200);
      const opengraphImageHtml = await response.text();
      expect(opengraphImageHtml).toMatchInlineSnapshot(`
        "<!-- Formatted HTML -->
        <!doctype html>
        <html>
          <body
            style="font-family: &#34;Inter Variable&#34;;
                   background: white;
                   height: 100vh;
                   width: 100vw;
                   display: flex;
                   flex-direction: column;
                   align-items: center;
                   justify-content: center;"
          >
            <h1 style="font-weight: 800; font-size: 5rem; margin: 0">
              Kurt's Website!
            </h1>
            <p style="font-weight: 400; font-size: 2rem">
              This is rendered as a PNG image.
            </p>
          </body>
        </html>"
      `);
    });
  });

  describe("SSR", async () => {
    let app: TestApp;

    beforeAll(async () => {
      const fixture = await loadFixture({
        root: "./fixtures/basic/",
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
      expect(response).toHaveProperty("status", 200);
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
      expect(response).toHaveProperty("status", 200);
      const aboutJson = (await response.json()) as unknown;
      expect(aboutJson).toBeTruthy();
      expect(aboutJson).toBeTypeOf("object");
      expect(aboutJson).toHaveProperty("name", "Astro");
      expect(aboutJson).toHaveProperty("url", "https://astro.build/");
    });

    it("root opengraph.png should be an image", async () => {
      const response = await app.render(
        new Request(new URL("https://example.com/opengraph.png"), {}),
      );
      expect(response).toHaveProperty("status", 200);
      const imageArrayBuffer = await response.arrayBuffer();
      expect(imageArrayBuffer).toBeTruthy();
      const imageBuffer = Buffer.from(imageArrayBuffer);
      expect(imageBuffer).toMatchImageSnapshot();
    });

    it("root opengraph.png should have the correct headers", async () => {
      const response = await app.render(
        new Request(new URL("https://example.com/opengraph.png"), {}),
      );
      expect(response.headers.get("Content-Type")).toEqual("image/png");
    });

    it("nested opengraph.png with a static path should be an image", async () => {
      const response = await app.render(
        new Request(
          new URL("https://example.com/blog/hard-coded-article/opengraph.png"),
        ),
      );
      expect(response).toHaveProperty("status", 200);
      const imageArrayBuffer = await response.arrayBuffer();
      expect(imageArrayBuffer).toBeTruthy();
      const imageBuffer = Buffer.from(imageArrayBuffer);
      expect(imageBuffer).toMatchImageSnapshot();
    });
  });
});
