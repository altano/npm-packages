import { describe, it, expect } from "vitest";

// used in astro.config.ts
import integration from "@altano/astro-opengraph";

// used directly by end-user to make endpoints
import { makeOpengraphEndpoint } from "@altano/astro-opengraph/endpoint";

// implicitly used by meta.astro
import { getResolvedConfig } from "@altano/astro-opengraph/config";

// used indirectly by integration in astro.config.ts, but could also be used
// independently
import toolbar from "@altano/astro-opengraph/toolbar";

// used directly by end-user in their .astro components
import OpenGraphMeta from "@altano/astro-opengraph/components/meta.astro?raw";

describe("package exports", () => {
  it("should have defined exports", () => {
    expect(integration).toBeDefined();
    expect(makeOpengraphEndpoint).toBeDefined();
    expect(toolbar).toBeDefined();
    expect(getResolvedConfig).toBeDefined();

    // have to import .astro component w/ ?raw because our unit tests can't
    // import .astro files as-is. could maybe use Astro's container API to do
    // this better...
    expect(OpenGraphMeta).toBeDefined();
    expect(OpenGraphMeta.split("\n").slice(0, 2)).toMatchInlineSnapshot(`
      [
        "---",
        "import { getResolvedConfig } from "@altano/astro-opengraph/config";",
      ]
    `);
  });
});
