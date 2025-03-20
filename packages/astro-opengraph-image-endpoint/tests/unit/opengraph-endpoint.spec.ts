import assert from "node:assert/strict";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import {
  loadFixture,
  type DevServer,
  type TestApp,
} from "@inox-tools/astro-tests/astroFixture";
import type { Fixture } from "./utils/types.js";
import { type } from "arktype";
import testAdapter from "@inox-tools/astro-tests/testAdapter";
import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

const about = type({
  name: "string",
  url: "string",
});

describe("Opengraph Routes", () => {
  describe("SSG", async () => {
    let fixture: Fixture;

    beforeAll(async () => {
      fixture = await loadFixture({
        root: "./fixtures/opengraph-endpoint/",
        output: "static",
      });
      await fixture.clean();
      await fixture.build({});
    });

    it.skip("index.astro page should have unmodified contents", async () => {
      const indexAstroContents = await fixture.readFile("/index.html");
      if (indexAstroContents == null) {
        throw new Error(`Couldn't read index.html`);
      }
      expect(indexAstroContents).toMatchInlineSnapshot(
        `"<!DOCTYPE html><html> <head><title>Basic Example</title></head> <body> <h1>A Heading</h1> <p>Hello!</p> </body></html>"`,
      );
    });

    it.skip("about.json.ts endpoint should have unmodified contents", async () => {
      const aboutJsonContents = await fixture.readFile("/about.json");
      if (aboutJsonContents == null) {
        throw new Error(`Couldn't read about.json`);
      }
      const aboutJson = JSON.parse(aboutJsonContents) as unknown;
      const json = about.assert(aboutJson);
      assert.equal(json.name, "Astro");
      assert.equal(json.url, "https://astro.build/");
    });

    it("root opengraph-image.png endpoint should have image", async () => {
      const opengraphImagePng = await fixture.readFile("/opengraph-image.png");
      expect(opengraphImagePng).toMatchImageSnapshot();
    });

    it("nested opengraph-image.png endpoint should have image", async () => {
      const opengraphImagePng = await fixture.readFile(
        "/blog/article/opengraph-image.png",
      );
      expect(opengraphImagePng).toMatchImageSnapshot();
    });
  });

  describe.skip("DEV", async () => {
    let fixture: Fixture;
    let devServer: DevServer;

    beforeAll(async () => {
      fixture = await loadFixture({
        root: "./fixtures/opengraph-endpoint/",
        output: "server",
      });
      await fixture.clean();
      devServer = await fixture.startDevServer({});
    });

    afterAll(async () => {
      await devServer.stop();
    });

    it("root astro template should have a dev route (for html debuggability)", async () => {
      // console.log(`glob = `, await fixture.glob("*"));
      const opengraphImageHtmlResponse = await fixture.fetch(
        "/opengraph-image.html",
      );
      expect(opengraphImageHtmlResponse).toHaveProperty("status", 200);
      const opengraphImageHtml = await opengraphImageHtmlResponse.text();
      expect(opengraphImageHtml).toMatchInlineSnapshot(`
        "<html> <body style="font-family: &#34;Inter Variable&#34;;
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

    it("nested astro template should have a dev route (for html debuggability)", async () => {
      // console.log(`glob = `, await fixture.glob("*"));
      const opengraphImageHtmlResponse = await fixture.fetch(
        "/blog/article/opengraph-image.html",
      );
      expect(opengraphImageHtmlResponse).toHaveProperty("status", 200);
      const opengraphImageHtml = await opengraphImageHtmlResponse.text();
      expect(opengraphImageHtml).toMatchInlineSnapshot(`
        "<html> <body style="font-family: &#34;Inter Variable&#34;;
                   background: white;
                   height: 100vh;
                   width: 100vw;
                   display: flex;
                   flex-direction: column;
                   align-items: center;
                   justify-content: center;"> <h1 style="font-weight: 800;
                     font-size: 5rem;
                     margin: 0;">
        ze blog ARTICLE
        </h1> <article style="font-weight: 400;
                      font-size: 2rem;">
        words words words bloviating words
        </article> </body></html>"
      `);
    });
  });

  describe.skip("SSR", async () => {
    let app: TestApp;

    beforeAll(async () => {
      const fixture = await loadFixture({
        root: "./fixtures/opengraph-endpoint/",
        output: "server",
        adapter: testAdapter(),
      });
      await fixture.clean();
      await fixture.build({});
      app = await fixture.loadTestAdapterApp();
    });

    it("index.astro page should have unmodified contents", async () => {
      const indexAstroResponse = await app.render(
        new Request(new URL("https://example.com")),
      );
      expect(indexAstroResponse).toHaveProperty("ok", true);
      expect(indexAstroResponse).toHaveProperty("status", 200);
      const indexAstroContents = await indexAstroResponse.text();
      expect(indexAstroContents).toMatchInlineSnapshot(
        `"<!DOCTYPE html><html> <head><title>Basic Example</title></head> <body> <h1>A Heading</h1> <p>Hello!</p> </body></html>"`,
      );
    });

    it("about.json.ts endpoint should have unmodified contents", async () => {
      const aboutJsonResponse = await app.render(
        new Request(new URL("https://example.com/about.json")),
      );
      expect(aboutJsonResponse).toHaveProperty("ok", true);
      expect(aboutJsonResponse).toHaveProperty("status", 200);
      const aboutJson = (await aboutJsonResponse.json()) as unknown;
      const json = about.assert(aboutJson);
      assert.equal(json.name, "Astro");
      assert.equal(json.url, "https://astro.build/");
    });
  });
});
