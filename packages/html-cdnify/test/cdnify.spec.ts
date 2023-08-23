// jscs:disable maximumLineLength

/// <reference path="../typings/main.d.ts" />

import {cdnify, CdnifyOptions} from "../src/cdnify";

import * as chai from "chai";
chai.should();

import * as chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

describe("cdnify", function() {
  it("should conveniently wrap CDNTransformer", function() {
    let cdnifyOptions: CdnifyOptions = {
      cdnUrl: "//cdn.alan.norbauer.com/cdn/",
      bufferPath: "test.html",
      buffer: new Buffer(`<html><img src="/face.png" data-cdn-ignore><img src="/face.png"></html>`),
    };

    return cdnify(cdnifyOptions)
      .then(buffer => buffer.toString())
      .should.eventually.equal(`<html><img src="/face.png"><img src="//cdn.alan.norbauer.com/cdn/face.png"></html>`);
  });
});
