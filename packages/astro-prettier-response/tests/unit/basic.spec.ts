import { beforeAll, describe, expect, it } from "vitest";
import { loadFixture } from "@inox-tools/astro-tests/astroFixture";
import type { Fixture } from "./utils/types.js";
import prettierResponse from "../../src/index.js";

describe("basic", () => {
  let fixture: Fixture;

  beforeAll(async () => {
    fixture = await loadFixture({
      root: "../fixtures/basic/",
      output: "static",
      integrations: [prettierResponse({})],
    });
    await fixture.build({});
  });

  it("index.astro page should be formatted", async () => {
    const contents = await fixture.readFile("/index.html");
    expect(contents).toBeDefined();

    // We don't want to use my snapshot serializer in @altano/vitest-plugins
    // because I have a snapshot serializer that prettier formats output, and
    // we're explicitly testing that the output is _already_ formatted.
    //
    // If the output starts with `<!-- Formatted HTML -->` the serializer is
    // installed and this isn't testing anything.
    //
    // In terms of expected output, note that:
    //   - In the CSS, the comments and whitespace are preserved
    //   - The HTML is the same, since compressHTML only performs transforms that Prettier completely reverses
    //   - In the JS, the symbol names (e.g. `doSomething`) are not mangled
    //
    expect(contents).toMatchInlineSnapshot(`
      "<!doctype html>
      <html data-astro-cid-j7pv25f6>
        <head>
          <title>Basic Example</title>
          <style>
            @layer global {
              :root {
                /* Typography and colors */
                font-family: var(--font-inter);
                background: var(--bg);
                color: var(--text);

                /* Headings */
                h1 {
                  margin-top: 3rem;
                }

                /* Section headings and Table of Contents heading */
                h2 {
                  margin-top: 2rem;
                }
              }
            }
            .main-heading[data-astro-cid-j7pv25f6] {
              color: red;
            }
            body {
              font-size: 20px;
            }
          </style>
        </head>
        <body data-astro-cid-j7pv25f6>
          <h1 class="main-heading" data-astro-cid-j7pv25f6>A Heading</h1>
          <p data-astro-cid-j7pv25f6>Hello!</p>
          <script type="module">
            function doSomething(variable) {
              console.log(variable);
            }
            doSomething("Hi how are you");
          </script>
        </body>
      </html>
      "
    `);
  });

  it("about.json.ts endpoint should be formatted", async () => {
    const contents = await fixture.readFile("/about.json");
    expect(contents).toBeDefined();
    expect(contents).toMatchInlineSnapshot(`
      "{
        "name": "Astro",
        "url": "https://astro.build/"
      }
      "
    `);
  });

  it("image.png endpoint should not be modified", async () => {
    const image = await fixture.readFileAsBuffer("/image.png");
    expect(image).toBeDefined();
    expect(image?.toString()).toEqual(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2O4v3EyBwAGwgIsY3pRcwAAAABJRU5ErkJggg==",
    );
  });
});
