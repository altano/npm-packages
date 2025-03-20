import assert from "node:assert/strict";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import {
  loadFixture,
  type TestApp,
} from "@inox-tools/astro-tests/astroFixture";
import type { Fixture } from "./utils/types.js";
import { type } from "arktype";
import testAdapter from "@inox-tools/astro-tests/testAdapter";

const about = type({
  name: "string",
  url: "string",
});

describe("Basic Page and Endpoint Routes", () => {
  describe("SSG", async () => {
    let fixture: Fixture;

    beforeAll(async () => {
      fixture = await loadFixture({
        root: "./fixtures/basic/",
        output: "static",
      });
      await fixture.clean();
      await fixture.build({});
    });

    it("index.astro page should have unmodified contents", async () => {
      const indexAstroContents = await fixture.readFile("/index.html");
      if (indexAstroContents == null) {
        throw new Error(`Couldn't read index.html`);
      }
      expect(indexAstroContents).toMatchInlineSnapshot(
        `"<!DOCTYPE html><html> <head><title>Basic Example</title></head> <body> <h1>A Heading</h1> <p>Hello!</p> </body></html>"`,
      );
    });

    it("about.json.ts endpoint should have unmodified contents", async () => {
      const aboutJsonContents = await fixture.readFile("/about.json");
      if (aboutJsonContents == null) {
        throw new Error(`Couldn't read about.json`);
      }
      const aboutJson = JSON.parse(aboutJsonContents) as unknown;
      const json = about.assert(aboutJson);
      assert.equal(json.name, "Astro");
      assert.equal(json.url, "https://astro.build/");
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
