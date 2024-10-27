import { describe, expect, it } from "vitest";
import { CDNTransformer, cdnify } from "../../src/index.js";
import type { CDNTransformerOptions, CdnifyOptions } from "../../src/index.js";
import * as stream from "node:stream";
import streamToPromise from "stream-to-promise";
import streamifier from "streamifier";

async function verify(
  options: CDNTransformerOptions,
  input: string,
  output: string,
): Promise<void> {
  const cdnifyOptions: CdnifyOptions = Object.assign({}, options, {
    buffer: input,
  });

  const result = cdnify(cdnifyOptions).then((buffer) => buffer.toString());
  await expect(result).resolves.toEqual(output);
}

const basicVerify = verify.bind(null, {
  cdnUrl: "//cdn.com/cdn/",
  bufferPath: "test.html",
});

describe("CDNTransformer", function () {
  describe("when encountering data-cdn-ignore attribute", function () {
    it("should not modify the element", async function () {
      await basicVerify(
        `<html><img src="/face.png"><some-other-element data-cdn-ignore=true src="cow.js"></html>`,
        `<html><img src="//cdn.com/cdn/face.png"><some-other-element src="cow.js"></html>`,
      );
    });

    it("should remove the data-cdn-ignore attribute", async function () {
      await basicVerify(
        `<html><img src="/face.png" data-cdn-ignore></html>`,
        `<html><img src="/face.png"></html>`,
      );
    });
  });

  it("should CDN-ify an image src into an output stream", function () {
    return new Promise<void>((resolve, reject) => {
      const transformer = new CDNTransformer({
        cdnUrl: "http://cdn.com",
      });

      const transformStream: stream.Transform = transformer.stream;

      const readStream: stream.Readable = streamifier.createReadStream(
        `<img src="face.png"><img src="face.png"><img src="face.png">`,
      );

      const outputStream = readStream.pipe(transformStream);

      const chunks: string[] = [];

      outputStream.on("data", (chunk: Buffer) => chunks.push(chunk.toString()));

      outputStream.on("end", () => {
        expect(chunks.join("")).to.equal(
          `<img src="http://cdn.com/face.png"><img src="http://cdn.com/face.png"><img src="http://cdn.com/face.png">`,
        );
        resolve();
      });

      outputStream.on("error", (err: Error) => reject(err));
    });
  });

  describe("when bad HTML is passed in", function () {
    it.skip("should fire 'error' event on the transform stream", async function () {
      const promise = new Promise<void>((resolve, reject) => {
        const transformer = new CDNTransformer({
          cdnUrl: "http://cdn.com",
        });

        const outputStream: stream.Writable = streamifier
          .createReadStream(`BAD HTML`)
          .pipe(transformer.stream);

        outputStream.on("end", () => {
          resolve();
        });

        outputStream.on("error", (err: Error) => reject(err));
      });
      await expect(promise).rejects.toThrow();
    });
  });

  it("should CDN-ify an image src", async function () {
    await basicVerify(
      `<html><img src="face.png"></html>`,
      `<html><img src="//cdn.com/cdn/face.png"></html>`,
    );
  });

  it("should CDN-ify a script src", async function () {
    await basicVerify(
      `<html><script src="face.js" type="text/javascript"></script></html>`,
      `<html><script src="//cdn.com/cdn/face.js" type="text/javascript"></script></html>`,
    );
  });

  it("should not touch an inline script", async function () {
    await basicVerify(
      `<html><script>let face = "hi";</script></html>`,
      `<html><script>let face = "hi";</script></html>`,
    );
  });

  it("should CDN-ify a stylesheet", async function () {
    await basicVerify(
      `<html><link rel="stylesheet" href="/css/main.css"></html>`,
      `<html><link rel="stylesheet" href="//cdn.com/cdn/css/main.css"></html>`,
    );
  });

  it("should CDN-ify with crazy whitespace", async function () {
    await basicVerify(
      `<html>
          <link      rel="stylesheet"
   href="       /css/main.css"
            ></html>`,
      `<html>
          <link rel="stylesheet" href="//cdn.com/cdn/css/main.css"></html>`,
    );
  });

  it("should CDN-ify a stylesheet", async function () {
    await basicVerify(
      `<html><link rel="stylesheet" href="/css/main.css"></html>`,
      `<html><link rel="stylesheet" href="//cdn.com/cdn/css/main.css"></html>`,
    );
  });

  it("should CDN-ify an icon", async function () {
    await basicVerify(
      `<html><link href="/images/favicon.ico" rel="shortcut icon" type="image/ico"></html>`,
      `<html><link href="//cdn.com/cdn/images/favicon.ico" rel="shortcut icon" type="image/ico"></html>`,
    );
  });

  it("should CDN-ify a favicon ico", async function () {
    await basicVerify(
      `<html><link href="/images/icon.png" rel="icon" type="image/png"></html>`,
      `<html><link href="//cdn.com/cdn/images/icon.png" rel="icon" type="image/png"></html>`,
    );
  });

  it("should not touch a data uri", async function () {
    await basicVerify(
      `<html><img src="data:text/plain;charset=utf-8,face"></html>`,
      `<html><img src="data:text/plain;charset=utf-8,face"></html>`,
    );
  });

  it("should include the input directory ('articles') in the URL", async function () {
    await verify(
      {
        cdnUrl: "//cdn.com/cdn/",
        bufferPath: "articles/test.html",
      },
      `<html><img src="face.png" /></html>`,
      `<html><img src="//cdn.com/cdn/articles/face.png"></html>`,
    );
  });

  it("should only modify tags that are being transformed", async function () {
    await basicVerify(
      `<html><img src="/face.png" /><span style="color:red" /></html>`,
      `<html><img src="//cdn.com/cdn/face.png"><span style="color:red" /></html>`,
    );
  });

  it("should modify all images in srcset", async function () {
    await basicVerify(
      `<html><img srcset="face1.png 1000w,face2.png 2000w"></html>`,
      `<html><img srcset="//cdn.com/cdn/face1.png 1000w,//cdn.com/cdn/face2.png 2000w"></html>`,
    );
  });

  it("should not modify span[src]", async function () {
    await basicVerify(
      `<html><span src="/face.png" /></html>`,
      `<html><span src="/face.png" /></html>`,
    );
  });

  it("should not modify messed up HTML", async function () {
    await basicVerify(
      `<html><p><div></div>>>>><<<<<<<</p></html>`,
      `<html><p><div></div>>>>><<<<<<<</p></html>`,
    );
  });

  it("should handle an incomplete DOM", async function () {
    await basicVerify(
      `<img src="face.jpg" />`,
      `<img src="//cdn.com/cdn/face.jpg">`,
    );
  });

  describe("when specifying a pre-existing transformDefinition", function () {
    it("should override the default behavior", async function () {
      await verify(
        {
          cdnUrl: "//cdn.com/cdn/",
          transformDefinitions: [
            {
              selector: "img[src]",
              attribute: "src",
              attributeParser: (oldAttribute, transformFunction): string =>
                transformFunction(oldAttribute.toUpperCase()),
            },
          ],
        },
        `<img src="/face7.png">`,
        `<img src="//cdn.com/cdn/FACE7.PNG">`,
      );
    });

    it("should allow disabling the pre-existing transformDefinition while letting others continue to work", async function () {
      await verify(
        {
          cdnUrl: "//cdn.com/",
          transformDefinitions: [
            {
              selector: "img[src]:not([data-cdn-ignore])",
              attribute: "src",
              attributeParser: (oldAttribute): string => oldAttribute,
            },
          ],
        },
        `<img src="face7.png"><img srcset="one.png 700,two.png 800">`,
        `<img src="face7.png"><img srcset="//cdn.com/one.png 700,//cdn.com/two.png 800">`,
      );
    });
  });

  describe("when passed a bad attribute", function () {
    it("should throw an error", function () {
      expect(() => {
        new CDNTransformer({
          cdnUrl: "//cdn.com/cdn/",
          bufferPath: "articles/test.html",
          transformDefinitions: [
            {
              selector: "custom-element[src]",
              // @ts-expect-error testing error path
              attribute: 1,
            },
          ],
        });
      }).toThrowError(Error);
    });
  });

  describe("when passed a bad selector", function () {
    it("should throw an error", function () {
      expect(() => {
        new CDNTransformer({
          cdnUrl: "//cdn.com/cdn/",
          bufferPath: "articles/test.html",
          transformDefinitions: [
            {
              // @ts-expect-error testing error path
              selector: 1,
              attribute: "srcfac2e",
            },
          ],
        });
      }).toThrowError(Error);
    });
  });

  describe("when passed a bad attribute parser", function () {
    it("should throw an error", function () {
      expect(() => {
        new CDNTransformer({
          cdnUrl: "//cdn.com/cdn/",
          bufferPath: "articles/test.html",
          transformDefinitions: [
            {
              selector: "asdf89",
              attribute: "srcfac2e",
              // @ts-expect-error testing error path
              attributeParser: "asj9d8fjas9d8fj",
            },
          ],
        });
      }).toThrowError(Error);
    });
  });

  describe("when not passed cdnUrl", function () {
    it("should throw an error", function () {
      expect(() => {
        // @ts-expect-error testing error path
        new CDNTransformer({});
      }).toThrowError(Error);
    });

    it("should default to '.'", async function () {
      await verify(
        {
          cdnUrl: "//cdn.com",
        },
        `<html><img src="/face.png"></html>`,
        `<html><img src="//cdn.com/face.png"></html>`,
      );
    });
  });

  describe("when not passed an bufferPath", function () {
    it("should default to cwd", async function () {
      await verify(
        {
          cdnUrl: "//cdn.com/cdn/",
        },
        `<html><img src="face.png" /></html>`,
        `<html><img src="//cdn.com/cdn/face.png"></html>`,
      );
    });

    it("should default to cwd", async function () {
      await verify(
        {
          cdnUrl: "//cdn.com/cdn/",
        },
        `<html><img src="articles/face.png" /></html>`,
        `<html><img src="//cdn.com/cdn/articles/face.png"></html>`,
      );
    });
  });

  describe("when encountering a root-relative URL", function () {
    it("should remove the input directory but keep the CDN directory", async function () {
      await basicVerify(
        `<html><img src="/face.png"></html>`,
        `<html><img src="//cdn.com/cdn/face.png"></html>`,
      );
    });
  });

  describe("when no transformDefinition is specified", function () {
    it("should not modify a custom element", async function () {
      await verify(
        {
          cdnUrl: "//cdn.com",
        },
        `<html><custom-element src="/face7.png"></html>`,
        `<html><custom-element src="/face7.png"></html>`,
      );
    });
  });

  describe("with a custom transformFunction", function () {
    it("should allow blindly adding a string", async function () {
      await verify(
        {
          cdnUrl: "//cdn.com",
          transformFunction: (cdnUrl, oldUrl, _bufferPath) => {
            return cdnUrl + "/subdir" + oldUrl;
          },
        },
        `<html><img src="/logo.png"></html>`,
        `<html><img src="//cdn.com/subdir/logo.png"></html>`,
      );
    });

    it("should allow delegating to the default transformFunction", async function () {
      await verify(
        {
          cdnUrl: "//cdn.com",
          transformFunction: (cdnUrl, oldUrl, bufferPath) => {
            const customCdnBaseUrl = oldUrl.endsWith(".png")
              ? "//imagecdn.com"
              : "//assetcdn.com";
            return CDNTransformer.defaultTransformFunction(
              customCdnBaseUrl,
              oldUrl,
              bufferPath,
            );
          },
        },
        `<img src="logo.png"><script src="main.js"></script>`,
        `<img src="//imagecdn.com/logo.png"><script src="//assetcdn.com/main.js"></script>`,
      );
    });
  });

  describe("when multiple transformDefitions target the same element", function () {
    it("should call transformFunction multiple times", async function () {
      await verify(
        {
          cdnUrl: "//cdn.com/cdn/",
          transformDefinitions: [
            {
              selector: "custom-element[src]",
              attribute: "src",
              attributeParser: (oldAttribute, _transformFunction): string =>
                oldAttribute.toUpperCase(),
            },
            {
              selector: "custom-element[href]",
              attribute: "href",
              attributeParser: (oldAttribute, _transformFunction): string =>
                oldAttribute.toUpperCase(),
            },
          ],
        },
        `<html><custom-element src="src-face.png" href="href-face.png"></html>`,
        `<html><custom-element src="SRC-FACE.PNG" href="HREF-FACE.PNG"></html>`,
      );
    });

    it("should call transformFunction on the matching selector only", async function () {
      await verify(
        {
          cdnUrl: "//cdn.com/cdn/",
          transformDefinitions: [
            {
              selector: "custom-element:not([src])",
              attribute: "src",
              attributeParser: (oldAttribute, _transformFunction): string =>
                oldAttribute.toUpperCase(),
            },
            {
              selector: "custom-element[src]",
              attribute: "src",
              attributeParser: (oldAttribute, _transformFunction): string =>
                oldAttribute + ".gif",
            },
          ],
        },
        `<custom-element src="src-face.png"></custom-element>`,
        `<custom-element src="src-face.png.gif"></custom-element>`,
      );
    });

    describe("and one of the transformDefinitions is a default", function () {
      it("should call all transformDefinitions that match, default or otherwise", async function () {
        await verify(
          {
            cdnUrl: "//cdn.com/cdn/",
            transformDefinitions: [
              {
                selector: "img[src][data-cdn-ignore]",
                attribute: "src",
                attributeParser: (oldAttribute, _transformFunction): string =>
                  oldAttribute + ".ignored",
              },
            ],
          },
          `<img src="src-face.png" data-cdn-ignore>`,
          `<img src="src-face.png.ignored">`,
        );
      });

      it("should still call default transformFunction for matching defaultTransformDefinition", async function () {
        await verify(
          {
            cdnUrl: "//cdn.com/cdn/",
            // transformFunction: CDNTransformer.defaultTransformFunction,
            transformDefinitions: [
              {
                selector: "img[src][data-cdn-ignore]",
                attribute: "src",
                attributeParser: (oldAttribute, _transformFunction) =>
                  oldAttribute + ".ignored",
              },
            ],
          },
          `<img src="noignore.png"><img src="ignore.png" data-cdn-ignore>`,
          `<img src="//cdn.com/cdn/noignore.png"><img src="ignore.png.ignored">`,
        );
      });

      it("should still call custom transformFunction specified", async function () {
        await verify(
          {
            cdnUrl: "//cdn.com/cdn/",
            transformFunction: (cdnUrl, oldUrl) => oldUrl.toUpperCase(),
            transformDefinitions: [
              {
                selector: "img[src][data-cdn-ignore]",
                attribute: "src",
                attributeParser: (oldAttribute, _transformFunction): string =>
                  oldAttribute + ".ignored",
              },
            ],
          },
          `<img src="noignore.png"><img src="face.png" data-cdn-ignore>`,
          `<img src="NOIGNORE.PNG"><img src="face.png.ignored">`,
        );
      });

      it("should allow lots of custom transformDefinitions to target [data-cdn-ignore]", async function () {
        const upperCaseAttributeWithoutTransform = (
          oldAttribute: string,
        ): string => oldAttribute.toUpperCase();

        const options = {
          // transformFunction: transformFunction,

          // These transform definitions allow us to capture attributes of ignored
          // elements and still fingerprint them. @TODO Move to separate plugin?
          transformDefinitions: [
            {
              selector: `video[poster][data-cdn-ignore]`,
              attribute: "poster",
              attributeParser: upperCaseAttributeWithoutTransform,
            },
            {
              selector: `img[data-src][data-cdn-ignore]`,
              attribute: "data-src",
              attributeParser: upperCaseAttributeWithoutTransform,
            },
            {
              selector: `script[src][data-cdn-ignore]`,
              attribute: "src",
              attributeParser: upperCaseAttributeWithoutTransform,
            },
            {
              selector: `source[src][data-cdn-ignore]`,
              attribute: "src",
              attributeParser: upperCaseAttributeWithoutTransform,
            },
            {
              selector: `link[rel="apple-touch-icon"][data-cdn-ignore]`,
              attribute: "href",
              attributeParser: upperCaseAttributeWithoutTransform,
            },
            {
              selector: `link[rel="icon"][data-cdn-ignore]`,
              attribute: "href",
              attributeParser: upperCaseAttributeWithoutTransform,
            },
            {
              selector: `link[rel="shortcut icon"][data-cdn-ignore]`,
              attribute: "href",
              attributeParser: upperCaseAttributeWithoutTransform,
            },
            {
              selector: `link[rel="stylesheet"][data-cdn-ignore]`,
              attribute: "href",
              attributeParser: upperCaseAttributeWithoutTransform,
            },
            {
              selector: `img[src][data-cdn-ignore]`,
              attribute: "src",
              attributeParser: upperCaseAttributeWithoutTransform,
            },
          ],
          cdnUrl: "//cdn.com/cdn/",
        };

        await verify(
          options,
          `<img src="noignore.png"><img src="face.png" data-cdn-ignore>`,
          `<img src="//cdn.com/cdn/noignore.png"><img src="FACE.PNG">`,
        );
      });
    });
  });

  describe("with a custom transformDefinition with a custom attributeParser", function () {
    it("should still CDN-ify properly", async function () {
      await verify(
        {
          cdnUrl: "//cdn.com/cdn/",
          bufferPath: "articles/test.html",
          transformDefinitions: [
            {
              selector: "custom-element[src]",
              attribute: "src",
              attributeParser: (oldAttribute, _transformFunction) =>
                oldAttribute.toUpperCase(),
            },
          ],
        },
        `<html><custom-element src="/face7.png"></html>`,
        `<html><custom-element src="/FACE7.PNG"></html>`,
      );
    });

    it.skip("should handle namespaces", async function () {
      const transformer = new CDNTransformer({
        cdnUrl: "//cdn.com",
        transformDefinitions: [
          {
            attribute: "foo",
            selector: "[foo]",
          },
        ],
      });

      const outputStream = streamifier
        .createReadStream(
          `<some:namespace foo="value">
<element foo="other-value">`,
        )
        .pipe(transformer.stream);

      const result = streamToPromise(outputStream).then((buffer: Buffer) =>
        buffer.toString(),
      );

      await expect(result).resolves.to
        .toEqual(`<some:namespace foo="//cdn.com/cdn/value">
<element foo="//cdn.com/cdn/other-value">`);
    });
  });
});
