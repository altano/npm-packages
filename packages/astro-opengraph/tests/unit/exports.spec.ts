import { describe, it, expect } from "vitest";
import integration from "@altano/astro-opengraph";
import { makeOpengraphEndpoint } from "@altano/astro-opengraph/endpoint";
import toolbar from "@altano/astro-opengraph/toolbar";
import OpenGraphMeta from "@altano/astro-opengraph/components/meta.astro?raw";

describe("package exports", () => {
  it("should have defined exports", () => {
    expect(integration).toBeDefined();
    expect(makeOpengraphEndpoint).toBeDefined();
    expect(toolbar).toBeDefined();

    // have to import .astro component w/ ?raw because our unit tests can't
    // import .astro files as-is
    expect(OpenGraphMeta).toBeDefined();
    expect(OpenGraphMeta.split("\n").slice(0, 2)).toMatchInlineSnapshot(`
      [
        "---",
        "import { getResolvedConfig } from "../src/config";",
      ]
    `);
  });
});
