import { beforeAll, describe, expect, it } from "vitest";
import { loadFixture } from "@inox-tools/astro-tests/astroFixture";
import type { Fixture } from "./utils/types.js";
import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

describe("Catch-all", () => {
  let fixture: Fixture;

  beforeAll(async () => {
    fixture = await loadFixture({
      root: "../fixtures/catch-all/",
      output: "static",
    });
    await fixture.build({});
  });

  it("index.astro page should match snapshot", async () => {
    const contents = await fixture.readFile("/index.html");
    expect(contents).toBeTruthy();
    expect(contents).toMatchInlineSnapshot(`
      "<!-- Formatted HTML -->
      <!doctype html>
      <html>
        <head>
          <meta property="og:image" content="http://localhost/opengraph.png" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <title>Root Page</title>
        </head>
      </html>"
    `);
  });

  it("root opengraph.png endpoint should have image", async () => {
    const image = await fixture.readFileAsBuffer("/opengraph.png");
    expect(image).toBeTruthy();
    expect(image).toMatchImageSnapshot();
  });

  it("use-default folder should not have its own opengraph endpoint", async () => {
    expect(fixture.pathExists("/use-default/opengraph.png")).toStrictEqual(
      false,
    );
  });

  it("use-override folder should have its own opengraph endpoint", async () => {
    expect(fixture.pathExists("/use-override/opengraph.png")).toStrictEqual(
      true,
    );
  });

  it("use-default folder should have default image at root", async () => {
    const contents = await fixture.readFile("/use-default/index.html");
    expect(contents).toBeTruthy();
    expect(contents).toMatch(
      new RegExp(
        String.raw`<meta property="og:image" content="http://localhost:\d+/opengraph.png">`,
      ),
    );
    const pathname = getOpenGraphPathFromHtml(contents!);
    const image = await fixture.readFileAsBuffer(pathname);
    expect(image).toBeTruthy();
    expect(image).toMatchImageSnapshot();
  });

  it("use-override folder should use custom image in same directory", async () => {
    const contents = await fixture.readFile("/use-override/index.html");
    expect(contents).toBeTruthy();
    expect(contents).toMatch(
      new RegExp(
        String.raw`<meta property="og:image" content="http://localhost:\d+/use-override/opengraph.png">`,
      ),
    );
    const pathname = getOpenGraphPathFromHtml(contents!);
    const image = await fixture.readFileAsBuffer(pathname);
    expect(image).toBeTruthy();
    expect(image).toMatchImageSnapshot();
  });
});

function getOpenGraphPathFromHtml(html: string): string {
  const result = html.match(
    new RegExp(String.raw`<meta property="og:image" content="([^"]+)">`),
  );
  if (result == null) {
    throw new Error(`unexpected null result`);
  }
  const url = result[1];
  if (url == null) {
    throw new Error(`unexpected null result`);
  }
  const pathname = new URL(url).pathname;
  return pathname;
}
