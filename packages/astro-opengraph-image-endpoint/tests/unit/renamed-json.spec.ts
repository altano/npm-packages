import assert from "node:assert/strict";
import { beforeAll, describe, expect, it } from "vitest";
// import { loadFixture } from "./utils/astro/test-utils.js";
import { loadFixture } from "@inox-tools/astro-tests/astroFixture";
import type { Fixture } from "./utils/types.js";
import { type } from "arktype";

const about = type({
  name: "string",
  url: "string",
});

describe.skip("Renamed JSON Route", () => {
  let fixture: Fixture;

  beforeAll(async () => {
    fixture = await loadFixture({ root: "./fixtures/renamed-json/" });
  });

  describe("SSG", async () => {
    beforeAll(async () => {
      await fixture.build({});
    });

    // it("json endpoint should have original contents", async () => {
    //   const aboutJsonFileContents = await fixture.readFile("/about.json");
    //   if (aboutJsonFileContents == null) {
    //     throw new Error(`Couldn't read about.json`);
    //   }

    //   const foo = JSON.parse(aboutJsonFileContents) as unknown;
    //   const json = about.assert(foo);
    //   assert.equal(json.name, "Astro");
    //   assert.equal(json.url, "https://astro.build/");
    // });
  });

  describe("SSR", async () => {
    beforeAll(async () => {
      await fixture.preview({});
    });
  });

  // describe("png", () => {
  //   it("should not have had its encoding mangled", async () => {
  //     const buffer = await fixture.readFile("/placeholder.png", "base64");

  //     // Sanity check the first byte
  //     const hex = Buffer.from(buffer, "base64").toString("hex");
  //     const firstHexByte = hex.slice(0, 2);
  //     // If we accidentally utf8 encode the png, the first byte (in hex) will be 'c2'
  //     assert.notEqual(firstHexByte, "c2");
  //     // and if correctly encoded in binary, it should be '89'
  //     assert.equal(firstHexByte, "89");

  //     // Make sure the whole buffer (in base64) matches this snapshot
  //     assert.equal(
  //       buffer,
  //       "iVBORw0KGgoAAAANSUhEUgAAAGQAAACWCAMAAAAfZt10AAAABlBMVEXd3d3+/v7B/CFgAAAA3UlEQVR42u3ZMQ7DIBQFQeb+l06bNgUbG/5eYApLFjzWNE3TNE3TNE035av9AhAQEBBQGAQEFAaFQWFQGBQGhUGCKAwKgwQpDJ6JECgCRYIEikH8YAyCRyEGyRCDvBWRIPNNBpm/8G6kUM45EhXKlQfuFSHFpbFH+jt2j/S7xwqUYvBaCRIozZy6X2km7v1K8uwQIIWBwkBAQEBg3Tyj3z4LnzRBKgwKg8KgMEgQhaEwSBCFQWBEiMIgQQqDBCkMEqQw+APixYgcsa0TERs7D/F6xGmIAxCD/Iw4AvEB92Ec3ZAPdlMAAAAASUVORK5CYII=",
  //     );
  //   });
  // });
});
