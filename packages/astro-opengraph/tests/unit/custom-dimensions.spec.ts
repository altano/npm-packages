import { beforeAll, describe, expect, it } from "vitest";
import { loadFixture } from "@inox-tools/astro-tests/astroFixture";
import type { Fixture } from "./utils/types.js";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import "@altano/vitest-plugins/matchers";

expect.extend({ toMatchImageSnapshot });

describe("Custom Dimensions", () => {
  let fixture: Fixture;

  beforeAll(async () => {
    fixture = await loadFixture({
      root: "../fixtures/custom-dimensions/",
      output: "static",
    });
    await fixture.build({});
  });

  it("opengraph image dimensions should be custom dimensions from config", async () => {
    const opengraphImagePng = await fixture.readFileAsBuffer("/opengraph.png");
    expect(opengraphImagePng).toBeDefined();
    await expect(opengraphImagePng).toHaveExifProperty("ImageWidth", 307);
    await expect(opengraphImagePng).toHaveExifProperty("ImageHeight", 421);
  });

  it("opengraph image dimensions should be overrides from opengraph-small.png.ts endpoint", async () => {
    const opengraphImagePng = await fixture.readFileAsBuffer(
      "/opengraph-small.png",
    );
    expect(opengraphImagePng).toBeDefined();
    await expect(opengraphImagePng).toHaveExifProperty("ImageWidth", 200);
    await expect(opengraphImagePng).toHaveExifProperty("ImageHeight", 200);
  });

  describe("Component", () => {
    it("should reflect the custom dimensions", async () => {
      const html = await fixture.readFile("/component-uses/default/index.html");
      expect(html).toBeTruthy();
      expect(html).toContain(`<meta property="og:image:width" content="307">`);
      expect(html).toContain(`<meta property="og:image:height" content="421">`);
    });

    it("should give preference to dimensions passed as props", async () => {
      const html = await fixture.readFile(
        "/component-uses/prop-overrides/index.html",
      );
      expect(html).toBeTruthy();

      expect(html).toContain(`<meta property="og:image:width" content="78">`);
      expect(html).toContain(`<meta property="og:image:height" content="911">`);

      // doesn't belong here but check we can set the alt tag while we're here...
      expect(html).toContain(
        `<meta property="og:image:alt" content="alternative alt text">`,
      );
    });
  });
});
