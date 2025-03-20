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
      root: "./fixtures/custom-dimensions/",
      output: "static",
    });
    await fixture.clean();
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
});
