import { beforeAll, describe, expect, it } from "vitest";
import { loadFixture } from "@inox-tools/astro-tests/astroFixture";
import type { Fixture } from "./utils/types.js";
import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

describe("SSG build files", () => {
  let fixture: Fixture;

  beforeAll(async () => {
    fixture = await loadFixture({
      root: "../fixtures/ssg/",
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
    const contents = await fixture.readFile("/root-from-component/index.html");
    expect(contents).toBeTruthy();
    expect(contents).toMatch(
      new RegExp(
        String.raw`<meta property="og:image" content="http://localhost:\d+/opengraph.png">`,
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
      const html = await fixture.readFile("/component-uses/default/index.html");
      expect(html).toBeTruthy();
      expect(html).toMatch(
        new RegExp(
          String.raw`<meta property="og:image" content="http://localhost:\d+/component-uses/default/opengraph.png">`,
        ),
      );
      expect(html).toContain(
        `<meta property="og:image:type" content="image/png">`,
      );
      expect(html).toContain(`<meta property="og:image:width" content="1200">`);
      expect(html).toContain(`<meta property="og:image:height" content="630">`);
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
          String.raw`<meta property="og:image" content="http://localhost:\d+/component-uses/custom-props/face.png">`,
        ),
      );
      expect(html).toContain(
        `<meta property="og:image:type" content="image/facemime">`,
      );
      expect(html).toContain(`<meta property="og:image:width" content="101">`);
      expect(html).toContain(`<meta property="og:image:height" content="901">`);
      expect(html).toContain(
        `<meta property="og:title" content="I'm a computer">`,
      );
      expect(html).toContain(
        `<meta property="og:description" content="stop all the downloadin">`,
      );
    });

    it("should be able to use a component outside the pages directory", async () => {
      const html = await fixture.readFile(
        "/template-in-components-dir/index.html",
      );
      const imagePath = `/template-in-components-dir/opengraph.png`;
      expect(html).toMatch(
        new RegExp(
          String.raw`<meta property="og:image" content="http://localhost:\d+${imagePath}">`,
        ),
      );
      const image = await fixture.readFileAsBuffer(imagePath);
      expect(image).toBeTruthy();
      expect(image).toMatchImageSnapshot();
    });
  });
});
