// jscs:disable maximumLineLength

/// <reference path="../typings/main.d.ts" />

import {HtmlAttributeStreamTransformer} from "../src/HtmlAttributeStreamTransformer";

let streamifier = require("streamifier");

import * as chai from "chai";
chai.should();

import * as chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

describe("HtmlAttributeStreamTransformer", function() {
  it("should let me uppcase all src attributes", function() {
    let cdnTransformer = new HtmlAttributeStreamTransformer({
      transformDefinitions: [
        {
          selector: "[src]",
          attribute: "src",
        }
      ],
      transformFunction: (attribute: string) => attribute.toUpperCase()
    });

    streamifier
      .createReadStream(`<html><img src="hello"></html>`)
      .pipe(cdnTransformer.stream);

    return cdnTransformer.outputBufferPromise
             .then(buffer => buffer.toString())
             .should.eventually.equal(`<html><img src="HELLO"></html>`);
  });

  it("should skip over matched elements that don't have attribute values", function() {
    let cdnTransformer = new HtmlAttributeStreamTransformer({
      transformDefinitions: [
        {
          selector: "[src]",
          attribute: "src",
        }
      ],
      transformFunction: (attribute: string) => attribute.toUpperCase()
    });

    streamifier
      .createReadStream(`<html><img src></html>`)
      .pipe(cdnTransformer.stream);

    return cdnTransformer.outputBufferPromise
             .then(buffer => buffer.toString())
             .should.eventually.equal(`<html><img src></html>`);
  });
});