import { describe, expect, it } from "vitest";
import { VFile } from "vfile";

// We're not testing the absolute path serializer, but the test isn't
// reproducible without it. So just add both.
import "../../../src/serializers/setup";

describe("serializers", () => {
  describe("vFile", () => {
    it("should produce a snapshot for a plain text VFile (not Prettier supported)", () => {
      const file = new VFile({
        path: "~/example.txt",
        value: "Alpha *braavo* charlie.",
      });
      expect(file).toMatchInlineSnapshot(`
        FormattedVFile {
          "cwd": "<cwd>",
          "data": {},
          "history": [
            "~/example.txt",
          ],
          "messages": [],
          "value": "Alpha *braavo* charlie.",
        }
      `);
    });
    it("should produce a formatted snapshot for a Prettier-compatible file", () => {
      const file = new VFile({
        path: "~/example.js",
        value: `function face(  ) {console.log("hi" );   }`,
      });
      expect(file).toMatchInlineSnapshot(`
        FormattedVFile {
          "cwd": "<cwd>",
          "data": {},
          "history": [
            "~/example.js",
          ],
          "messages": [],
          "value": "function face() {
          console.log("hi");
        }",
        }
      `);
    });
    it("should throw if given a file that Prettier supports but can't format", () => {
      const file = new VFile({
        path: "~/example.js",
        value: `function (  ) {1   }`,
      });
      file.cwd = "/root/path"; // make snapshot reproducible
      expect(() => {
        expect(file).toMatchInlineSnapshot(`"function (  ) {1   }"`);
      }).toThrowErrorMatchingInlineSnapshot(`
        [PrettyFormatPluginError: Unexpected token (1:10)
        > 1 | function (  ) {1   }
            |          ^]
      `);
    });
    it("should remove absolute file paths in a vFile", () => {
      const file = new VFile({
        path: "~/example.json",
        value: `{ "key": "${import.meta.dirname}" }`,
      });
      expect(file).toMatchInlineSnapshot(`
        FormattedVFile {
          "cwd": "<cwd>",
          "data": {},
          "history": [
            "~/example.json",
          ],
          "messages": [],
          "value": "{
          "key": "<cwd>/tests/unit/serializers"
        }",
        }
      `);
    });
  });
});
