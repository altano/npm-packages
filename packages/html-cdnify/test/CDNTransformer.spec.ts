// jscs:disable maximumLineLength

/// <reference path="../typings/main.d.ts" />

import {CDNTransformer, CDNTransformFunction, CDNTransformerOptions, cdnify, CdnifyOptions} from "../src/cdnify";
import urlConverter from "../src/urlConverter";

let streamifier = require("streamifier");
let streamToPromise = require("stream-to-promise");
import * as url from "url";
import * as stream from "stream";

import * as chai from "chai";
chai.should();

import * as chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

function verify(options: CDNTransformerOptions, input: string, output: string) {
  let cdnifyOptions: CdnifyOptions = Object.assign({}, options, {buffer: input});

  return cdnify(cdnifyOptions)
    .then(buffer => buffer.toString())
    .should.eventually.equal(output);
}

let basicVerify = verify.bind(null, {
  cdnUrl: "//cdn.com/cdn/",
  bufferPath: "test.html"
});

describe("CDNTransformer", function() {
  context("when encountering data-cdn-ignore attribute", function() {
    it("should not modify the element", function() {
      return basicVerify(
        `<html><img src="/face.png"><some-other-element data-cdn-ignore=true src="cow.js"></html>`,
        `<html><img src="//cdn.com/cdn/face.png"><some-other-element src="cow.js"></html>`
      );
    });

    it("should remove the data-cdn-ignore attribute", function() {
      return basicVerify(
        `<html><img src="/face.png" data-cdn-ignore></html>`,
        `<html><img src="/face.png"></html>`
      );
    });
  });


  it("should CDN-ify an image src into an output stream", function() {
    return new Promise((resolve, reject) => {
      let transformer = new CDNTransformer({
        cdnUrl: "http://cdn.com"
      });

      let transformStream: stream.Transform = transformer.stream;

      let readStream: stream.Readable = streamifier
          .createReadStream(`<img src="face.png"><img src="face.png"><img src="face.png">`);

      let outputStream = readStream
          .pipe(transformStream);

      let chunks: string[] = [];

      outputStream.on("data", (chunk: Buffer) => chunks.push(chunk.toString()));

      outputStream.on("end", () => {
        chunks.join("").should.equal(`<img src="http://cdn.com/face.png"><img src="http://cdn.com/face.png"><img src="http://cdn.com/face.png">`);
        resolve();
      });

      outputStream.on("error", (err: Error) => reject(err));
    });
  });

  context("when bad HTML is passed in", function() {
    it.skip("should fire 'error' event on the transform stream", function() {
      return new Promise((resolve, reject) => {
        let transformer = new CDNTransformer({
          cdnUrl: "http://cdn.com"
        });

        let outputStream: stream.Writable = streamifier
            .createReadStream(`BAD HTML`)
            .pipe(transformer.stream);

        outputStream.on('end', () => {
          resolve();
        });

        outputStream.on('error', (err: Error) => reject(err));
      }).should.be.rejected;
    });
  });

  it("should CDN-ify an image src", function() {
    return basicVerify(
      `<html><img src="face.png"></html>`,
      `<html><img src="//cdn.com/cdn/face.png"></html>`
    );
  });

  it("should CDN-ify a script src", function() {
    return basicVerify(
      `<html><script src="face.js" type="text/javascript"></script></html>`,
      `<html><script src="//cdn.com/cdn/face.js" type="text/javascript"></script></html>`
    );
  });

  it("should not touch an inline script", function() {
    return basicVerify(
      `<html><script>let face = "hi";</script></html>`,
      `<html><script>let face = "hi";</script></html>`
    );
  });

  it("should CDN-ify a stylesheet", function() {
    return basicVerify(
      `<html><link rel="stylesheet" href="/css/main.css"></html>`,
      `<html><link rel="stylesheet" href="//cdn.com/cdn/css/main.css"></html>`
    );
  });

  it("should CDN-ify with crazy whitespace", function() {
    return basicVerify(
      `<html>
          <link      rel="stylesheet"
   href="       /css/main.css"
            ></html>`,
      `<html>
          <link rel="stylesheet" href="//cdn.com/cdn/css/main.css"></html>`
    );
  });

  it("should CDN-ify a stylesheet", function() {
    return basicVerify(
      `<html><link rel="stylesheet" href="/css/main.css"></html>`,
      `<html><link rel="stylesheet" href="//cdn.com/cdn/css/main.css"></html>`
    );
  });

  it("should CDN-ify an icon", function() {
    return basicVerify(
      `<html><link href="/images/favicon.ico" rel="shortcut icon" type="image/ico"></html>`,
      `<html><link href="//cdn.com/cdn/images/favicon.ico" rel="shortcut icon" type="image/ico"></html>`
    );
  });

  it("should CDN-ify a favicon ico", function() {
    return basicVerify(
      `<html><link href="/images/icon.png" rel="icon" type="image/png"></html>`,
      `<html><link href="//cdn.com/cdn/images/icon.png" rel="icon" type="image/png"></html>`
    );
  });

  it("should not touch a data uri", function() {
    return basicVerify(
      `<html><img src="data:text/plain;charset=utf-8,face"></html>`,
      `<html><img src="data:text/plain;charset=utf-8,face"></html>`
    );
  });

  it("should include the input directory ('articles') in the URL", function() {
    return verify({
        cdnUrl: "//cdn.com/cdn/",
        bufferPath: "articles/test.html"
      },
      `<html><img src="face.png" /></html>`,
      `<html><img src="//cdn.com/cdn/articles/face.png"></html>`
    );
  });

  it("should only modify tags that are being transformed", function() {
    return basicVerify(
      `<html><img src="/face.png" /><span style="color:red" /></html>`,
      `<html><img src="//cdn.com/cdn/face.png"><span style="color:red" /></html>`
    );
  });

  it("should modify all images in srcset", function() {
    return basicVerify(
      `<html><img srcset="face1.png 1000w,face2.png 2000w"></html>`,
      `<html><img srcset="//cdn.com/cdn/face1.png 1000w,//cdn.com/cdn/face2.png 2000w"></html>`
    );
  });

  it("should not modify span[src]", function() {
    return basicVerify(
      `<html><span src="/face.png" /></html>`,
      `<html><span src="/face.png" /></html>`
    );
  });

  it("should not modify messed up HTML", function() {
    return basicVerify(
      `<html><p><div></div>>>>><<<<<<<</p></html>`,
      `<html><p><div></div>>>>><<<<<<<</p></html>`
    );
  });

  it("should handle an incomplete DOM", function() {
    return basicVerify(
      `<img src="face.jpg" />`,
      `<img src="//cdn.com/cdn/face.jpg">`
    );
  });

  context("when specifying a pre-existing transformDefinition", function() {
    it("should override the default behavior", function() {
      return verify({
          cdnUrl: "//cdn.com/cdn/",
          transformDefinitions: [
            {
              selector: "img[src]",
              attribute: "src",
              attributeParser: (oldAttribute, transformFunction) => transformFunction(oldAttribute.toUpperCase())
            }
          ]
        },
        `<img src="/face7.png">`,
        `<img src="//cdn.com/cdn/FACE7.PNG">`
      );
    });

    it("should allow disabling the pre-existing transformDefinition while letting others continue to work", function() {
        return verify({
          cdnUrl: "//cdn.com/",
          transformDefinitions: [
            {
              selector: "img[src]:not([data-cdn-ignore])",
              attribute: "src",
              attributeParser: oldAttribute => oldAttribute
            }
          ]
        },
        `<img src="face7.png"><img srcset="one.png 700,two.png 800">`,
        `<img src="face7.png"><img srcset="//cdn.com/one.png 700,//cdn.com/two.png 800">`
      );
    });
  });

  context("when passed a bad attribute", function() {
    it("should throw an error", function() {
      (() => {
        new CDNTransformer({
          cdnUrl: "//cdn.com/cdn/",
          bufferPath: "articles/test.html",
          transformDefinitions: [
            {
              selector: "custom-element[src]",
              attribute: <any>1,
            }
          ]
        });
      }).should.throw(Error);
    });
  });

  context("when passed a bad selector", function() {
    it("should throw an error", function() {
      (() => {
        new CDNTransformer({
          cdnUrl: "//cdn.com/cdn/",
          bufferPath: "articles/test.html",
          transformDefinitions: [
            {
              selector: <any>1,
              attribute: "srcfac2e",
            }
          ]
        });
      }).should.throw(Error);
    });
  });

  context("when passed a bad attribute parser", function() {
    it("should throw an error", function() {
      (() => {
        new CDNTransformer({
          cdnUrl: "//cdn.com/cdn/",
          bufferPath: "articles/test.html",
          transformDefinitions: [
            {
              selector: "asdf89",
              attribute: "srcfac2e",
              attributeParser: <any>"asj9d8fjas9d8fj"
            }
          ]
        });
      }).should.throw(Error);
    });
  });

  context("when not passed cdnUrl", function() {
    it("should throw an error", function() {
      (() => {
        new CDNTransformer(<any>{
        });
      }).should.throw(Error);
    });

    it("should default to '.'", function() {

      return verify({
          cdnUrl: "//cdn.com"
        },
        `<html><img src="/face.png"></html>`,
        `<html><img src="//cdn.com/face.png"></html>`
      );
    });
  });

  context("when not passed an bufferPath", function() {
    it("should default to cwd", function() {
      return verify({
          cdnUrl: "//cdn.com/cdn/",
        },
        `<html><img src="face.png" /></html>`,
        `<html><img src="//cdn.com/cdn/face.png"></html>`
      );
    });

    it("should default to cwd", function() {
      return verify({
          cdnUrl: "//cdn.com/cdn/",
        },
        `<html><img src="articles/face.png" /></html>`,
        `<html><img src="//cdn.com/cdn/articles/face.png"></html>`
      );
    });
  });

  context("when encountering a root-relative URL", function() {
    it("should remove the input directory but keep the CDN directory", function() {
      return basicVerify(
        `<html><img src="/face.png"></html>`,
        `<html><img src="//cdn.com/cdn/face.png"></html>`
      );
    });
  });

  context("when no transformDefinition is specified", function() {
    it("should not modify a custom element", function() {
      return verify({
          cdnUrl: "//cdn.com"
        },
        `<html><custom-element src="/face7.png"></html>`,
        `<html><custom-element src="/face7.png"></html>`
      );
    });
  });

  context("with a custom transformFunction", function() {
    it("should allow blindly adding a string", function() {
      return verify({
          cdnUrl: "//cdn.com",
          transformFunction: (cdnUrl, oldUrl, bufferPath) => {
            return cdnUrl + "/subdir" + oldUrl;
          }
        },
        `<html><img src="/logo.png"></html>`,
        `<html><img src="//cdn.com/subdir/logo.png"></html>`
      );
    });

    it("should allow delegating to the default transformFunction", function() {
      return verify({
          cdnUrl: "//cdn.com",
          transformFunction: (cdnUrl, oldUrl, bufferPath) => {
            if (oldUrl.endsWith(".png")) {
              var customCdnBaseUrl = "//imagecdn.com";
            }
            else {
              var customCdnBaseUrl = "//assetcdn.com"
            }
            return CDNTransformer.defaultTransformFunction(customCdnBaseUrl, oldUrl, bufferPath);
          }
        },
        `<img src="logo.png"><script src="main.js"></script>`,
        `<img src="//imagecdn.com/logo.png"><script src="//assetcdn.com/main.js"></script>`
      );
    });
  });

  context("when multiple transformDefitions target the same element", function() {
    it("should call transformFunction multiple times", function() {
      return verify({
          cdnUrl: "//cdn.com/cdn/",
          transformDefinitions: [
            {
              selector: "custom-element[src]",
              attribute: "src",
              attributeParser: (oldAttribute, transformFunction) => oldAttribute.toUpperCase()
            },
            {
              selector: "custom-element[href]",
              attribute: "href",
              attributeParser: (oldAttribute, transformFunction) => oldAttribute.toUpperCase()
            }
          ]
        },
        `<html><custom-element src="src-face.png" href="href-face.png"></html>`,
        `<html><custom-element src="SRC-FACE.PNG" href="HREF-FACE.PNG"></html>`
      );
    });

    it("should call transformFunction on the matching selector only", function() {
      return verify({
          cdnUrl: "//cdn.com/cdn/",
          transformDefinitions: [
            {
              selector: "custom-element:not([src])",
              attribute: "src",
              attributeParser: (oldAttribute, transformFunction) => oldAttribute.toUpperCase()
            },
            {
              selector: "custom-element[src]",
              attribute: "src",
              attributeParser: (oldAttribute, transformFunction) => oldAttribute + ".gif"
            }
          ]
        },
        `<custom-element src="src-face.png"></custom-element>`,
        `<custom-element src="src-face.png.gif"></custom-element>`
      );
    });

    context("and one of the transformDefinitions is a default", function() {
      it("should call all transformDefinitions that match, default or otherwise", function() {
        return verify({
            cdnUrl: "//cdn.com/cdn/",
            transformDefinitions: [
              {
                selector: "img[src][data-cdn-ignore]",
                attribute: "src",
                attributeParser: (oldAttribute, transformFunction) => oldAttribute + ".ignored"
              }
            ]
          },
          `<img src="src-face.png" data-cdn-ignore>`,
          `<img src="src-face.png.ignored">`
        );
      });

      it("should still call default transformFunction for matching defaultTransformDefinition", function() {
        return verify({
            cdnUrl: "//cdn.com/cdn/",
            // transformFunction: CDNTransformer.defaultTransformFunction,
            transformDefinitions: [
              {
                selector: "img[src][data-cdn-ignore]",
                attribute: "src",
                attributeParser: (oldAttribute, transformFunction) => oldAttribute + ".ignored"
              }
            ]
          },
          `<img src="noignore.png"><img src="ignore.png" data-cdn-ignore>`,
          `<img src="//cdn.com/cdn/noignore.png"><img src="ignore.png.ignored">`
        );
      });

      it("should still call custom transformFunction specified", function() {
        return verify({
            cdnUrl: "//cdn.com/cdn/",
            transformFunction: (cdnUrl, oldUrl) => oldUrl.toUpperCase(),
            transformDefinitions: [
              {
                selector: "img[src][data-cdn-ignore]",
                attribute: "src",
                attributeParser: (oldAttribute, transformFunction) => oldAttribute + ".ignored"
              }
            ]
          },
          `<img src="noignore.png"><img src="face.png" data-cdn-ignore>`,
          `<img src="NOIGNORE.PNG"><img src="face.png.ignored">`
        );
      });

      it("should allow lots of custom transformDefinitions to target [data-cdn-ignore]", function() {
        let upperCaseAttributeWithoutTransform = (oldAttribute: string) => oldAttribute.toUpperCase();

        let options = {
          // transformFunction: transformFunction,

          // These transform definitions allow us to capture attributes of ignored
          // elements and still fingerprint them. @TODO Move to separate plugin?
          transformDefinitions: [
            {
              selector: `video[poster][data-cdn-ignore]`,
              attribute: "poster",
              attributeParser: upperCaseAttributeWithoutTransform
            },
            {
              selector: `img[data-src][data-cdn-ignore]`,
              attribute: "data-src",
              attributeParser: upperCaseAttributeWithoutTransform
            },
            {
              selector: `script[src][data-cdn-ignore]`,
              attribute: "src",
              attributeParser: upperCaseAttributeWithoutTransform
            },
            {
              selector: `source[src][data-cdn-ignore]`,
              attribute: "src",
              attributeParser: upperCaseAttributeWithoutTransform
            },
            {
              selector: `link[rel="apple-touch-icon"][data-cdn-ignore]`,
              attribute: "href",
              attributeParser: upperCaseAttributeWithoutTransform
            },
            {
              selector: `link[rel="icon"][data-cdn-ignore]`,
              attribute: "href",
              attributeParser: upperCaseAttributeWithoutTransform
            },
            {
              selector: `link[rel="shortcut icon"][data-cdn-ignore]`,
              attribute: "href",
              attributeParser: upperCaseAttributeWithoutTransform
            },
            {
              selector: `link[rel="stylesheet"][data-cdn-ignore]`,
              attribute: "href",
              attributeParser: upperCaseAttributeWithoutTransform
            },
            {
              selector: `img[src][data-cdn-ignore]`,
              attribute: "src",
              attributeParser: upperCaseAttributeWithoutTransform
            }
          ],
          cdnUrl: "//cdn.com/cdn/"
        };

        return verify(options,
          `<img src="noignore.png"><img src="face.png" data-cdn-ignore>`,
          `<img src="//cdn.com/cdn/noignore.png"><img src="FACE.PNG">`
        );
      })
    });
  });

  context("with a custom transformDefinition with a custom attributeParser", function() {
    it("should still CDN-ify properly", function() {
      return verify({
          cdnUrl: "//cdn.com/cdn/",
          bufferPath: "articles/test.html",
          transformDefinitions: [
            {
              selector: "custom-element[src]",
              attribute: "src",
              attributeParser: (oldAttribute, transformFunction) => oldAttribute.toUpperCase()
            }
          ]
        },
        `<html><custom-element src="/face7.png"></html>`,
        `<html><custom-element src="/FACE7.PNG"></html>`
      );
    });

    it.skip("should handle namespaces", function() {
      let transformer = new CDNTransformer({
        cdnUrl: "//cdn.com",
        transformDefinitions: [
          {
            attribute: "foo",
            selector: "[foo]",
          }
        ]
      });

      let outputStream = streamifier
        .createReadStream(`<some:namespace foo="value">
<element foo="other-value">`)
        .pipe(transformer.stream);

      return streamToPromise(outputStream)
        .then((buffer: Buffer) => buffer.toString())
        .should.eventually.equal(`<some:namespace foo="//cdn.com/cdn/value">
<element foo="//cdn.com/cdn/other-value">`);
    });
  });
});