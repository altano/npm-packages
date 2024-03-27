import { describe, it, expect } from "vitest";
import { HtmlAttributeStreamTransformer } from "../../src/HtmlAttributeStreamTransformer";

import streamifier from "streamifier";

describe("HtmlAttributeStreamTransformer", function () {
  it("should let me uppcase all src attributes", async function () {
    const cdnTransformer = new HtmlAttributeStreamTransformer({
      transformDefinitions: [
        {
          selector: "[src]",
          attribute: "src",
        },
      ],
      transformFunction: (attribute: string) => attribute.toUpperCase(),
    });

    streamifier
      .createReadStream(`<html><img src="hello"></html>`)
      .pipe(cdnTransformer.stream);

    const result = cdnTransformer.outputBufferPromise.then((buffer) =>
      buffer.toString(),
    );
    await expect(result).resolves.toEqual(`<html><img src="HELLO"></html>`);
  });

  it("should skip over matched elements that don't have attribute values", async function () {
    const cdnTransformer = new HtmlAttributeStreamTransformer({
      transformDefinitions: [
        {
          selector: "[src]",
          attribute: "src",
        },
      ],
      transformFunction: (attribute: string) => attribute.toUpperCase(),
    });

    streamifier
      .createReadStream(`<html><img src></html>`)
      .pipe(cdnTransformer.stream);

    const result = cdnTransformer.outputBufferPromise.then((buffer) =>
      buffer.toString(),
    );
    await expect(result).resolves.toEqual(`<html><img src></html>`);
  });
});
