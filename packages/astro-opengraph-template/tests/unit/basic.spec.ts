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
      const indexAstroContents = await fixture.readFile("/index.html");
      expect(indexAstroContents).toBeTruthy();
      expect(indexAstroContents).toMatchInlineSnapshot(
        `"<!DOCTYPE html><html> <head><meta property="og:image" content="http://localhost:25865/opengraph.png"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><title>Basic Example</title></head> <body> <h1>A Heading</h1> <p>Hello!</p> </body></html>"`,
      );
    });

    it("about.json.ts endpoint should have unmodified contents", async () => {
      const aboutJsonContents = await fixture.readFile("/about.json");
      expect(aboutJsonContents).toBeTruthy();
      const aboutJson = JSON.parse(aboutJsonContents!) as unknown;
      expect(aboutJson).toBeTruthy();
      expect(aboutJson).toBeTypeOf("object");
      expect(aboutJson).toHaveProperty("name", "Astro");
      expect(aboutJson).toHaveProperty("url", "https://astro.build/");
    });

    it("root opengraph.png endpoint should have image", async () => {
      const opengraphImagePng =
        await fixture.readFileAsBuffer("/opengraph.png");
      expect(opengraphImagePng).toBeTruthy();
      expect(opengraphImagePng).toMatchImageSnapshot();
    });

    // TODO fix this test
    it.todo(
      "nested opengraph.png with a static path endpoint should have image",
      async () => {
        const opengraphImagePng = await fixture.readFileAsBuffer(
          "/blog/hard-coded-article/opengraph.png",
        );
        expect(opengraphImagePng).toBeTruthy();
        expect(opengraphImagePng).toMatchImageSnapshot();
      },
    );

    it("nested opengraph.png with dynamic path and getStaticPaths should have an opengraph image", async () => {
      const opengraphImagePng = await fixture.readFileAsBuffer(
        "/blog/hello-world/opengraph.png",
      );
      expect(opengraphImagePng).toBeTruthy();
      expect(opengraphImagePng).toMatchImageSnapshot();
    });

    it.todo(
      "nested page without opengraph image should use root opengraph image",
    );

    it("opengraph image dimensions should default to 1200x630", async () => {
      const opengraphImagePng =
        await fixture.readFileAsBuffer("/opengraph.png");
      await expect(opengraphImagePng).toHaveExifProperty("ImageWidth", 1200);
      await expect(opengraphImagePng).toHaveExifProperty("ImageHeight", 630);
    });

    it.todo("page should have opengraph meta tags");

    it("should not have html from dev route in ssg", async () => {
      expect(fixture.pathExists("/opengraph.html")).toStrictEqual(false);
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
        "<!DOCTYPE html><html> <body style="font-family: &#34;Inter Variable&#34;;
                   background: white;
                   height: 100vh;
                   width: 100vw;
                   display: flex;
                   flex-direction: column;
                   align-items: center;
                   justify-content: center;"> <h1 style="font-weight: 800;
                     font-size: 5rem;
                     margin: 0;">
        Kurt's Website!
        </h1> <p style="font-weight: 400;
                      font-size: 2rem;">
        This is rendered as a PNG image.
        </p> </body></html>"
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
        `"<!DOCTYPE html><html> <head><meta property="og:image" content="https://example.com/opengraph.png"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><title>Basic Example</title></head> <body> <h1>A Heading</h1> <p>Hello!</p> </body></html>"`,
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
      const opengraphImagePngArrayBuffer = await response.arrayBuffer();
      expect(opengraphImagePngArrayBuffer).toBeTruthy();
      const opengraphImagePngBuffer = Buffer.from(opengraphImagePngArrayBuffer);
      expect(opengraphImagePngBuffer).toMatchImageSnapshot();
    });

    it("root opengraph.png should have the correct headers", async () => {
      const response = await app.render(
        new Request(new URL("https://example.com/opengraph.png"), {}),
      );
      expect(response.headers.get("Content-Type")).toEqual("image/png");
    });

    // TODO Fix this test
    it("nested opengraph.png with a static path should be an image", async () => {
      const response = await app.render(
        new Request(
          new URL("https://example.com/blog/hard-coded-article/opengraph.png"),
        ),
      );
      expect(response).toHaveProperty("status", 200);
      const opengraphImagePngArrayBuffer = await response.arrayBuffer();
      expect(opengraphImagePngArrayBuffer).toBeTruthy();
      const opengraphImagePngBuffer = Buffer.from(opengraphImagePngArrayBuffer);
      expect(opengraphImagePngBuffer).toMatchImageSnapshot();
    });

    it.todo(
      "nested opengraph.png with dynamic path and getStaticPaths should have an opengraph image",
    );

    it.todo(
      "nested opengraph.png with dynamic path and no getStaticPaths should have an opengraph image",
    );
  });
});
