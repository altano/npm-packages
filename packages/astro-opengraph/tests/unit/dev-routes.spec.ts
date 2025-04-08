import { beforeAll, afterAll, describe, expect, it } from "vitest";
import {
  loadFixture,
  type DevServer,
} from "@inox-tools/astro-tests/astroFixture";
import type { Fixture } from "./utils/types.js";
import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

describe("opengraph dev-only routes", () => {
  let fixture: Fixture;
  let devServer: DevServer;

  beforeAll(async () => {
    fixture = await loadFixture({
      root: "../fixtures/dev-routes/",
      output: "server",
    });
    devServer = await fixture.startDevServer({});
  });

  afterAll(async () => {
    await devServer.stop();
  });

  it("root should have an explicit dev html route (for html debuggability)", async () => {
    const response = await fixture.fetch("/opengraph.html");
    expect(response).toHaveStatus(200);
    const opengraphImageHtml = await response.text();
    expect(opengraphImageHtml).toMatchInlineSnapshot(`
      "<!-- Formatted HTML -->
      <!doctype html>
      <html>
        <body
          style="
            font-family: Inter Variable;
            background: white;
            height: 100vh;
            width: 100vw;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          "
        >
          <h1 style="font-weight: 800; font-size: 5rem; margin: 0">
            Kurt's Website!
          </h1>
          <p style="font-weight: 400; font-size: 2rem">
            This is rendered as a PNG image.
          </p>
        </body>
      </html>"
    `);
  });

  it("nested route does not have an html route", async () => {
    const response = await fixture.fetch("/root-from-endpoint/opengraph.html");
    expect(response).toHaveStatus(404);
  });
});
