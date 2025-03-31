import { describe, expect, it } from "vitest";

import htmlSerializer from "../../../src/serializers/html.js";
expect.addSnapshotSerializer(htmlSerializer);

describe("serializers", () => {
  describe("html", () => {
    it("should prettier format the html", () => {
      expect(
        `<html><head><title>your face</title></head><body>is stupid</body></html>`,
      ).toMatchInlineSnapshot(`
        "<!-- Formatted HTML -->
        <html>
          <head>
            <title>your face</title>
          </head>
          <body>
            is stupid
          </body>
        </html>"
      `);
    });
    it("should ignore already formatted html", () => {
      const html = `
        <html>
          <head>
            <title>your face</title>
          </head>
          <body>
            is stupid
          </body>
        </html>"
      `;
      expect(html).toMatchInlineSnapshot(`
        "
                <html>
                  <head>
                    <title>your face</title>
                  </head>
                  <body>
                    is stupid
                  </body>
                </html>"
              "
      `);
    });
    it("should ignore non-html strings", () => {
      expect(`I'm just some content that isn't html`).toMatchInlineSnapshot(
        `"I'm just some content that isn't html"`,
      );
    });
    it("should ignore malformed html", () => {
      expect(`<html><p>oiajsdfpoiajsdf</a></q></face>`).toMatchInlineSnapshot(`
        "<html><p>oiajsdfpoiajsdf</a></q></face>"
      `);
    });
  });
});
