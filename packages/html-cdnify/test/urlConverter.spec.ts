// jscs:disable maximumLineLength

/// <reference path="../typings/main.d.ts" />

import urlConverter from "../src/urlConverter";

let streamifier = require("streamifier");
let streamToPromise = require("stream-to-promise");

import * as chai from "chai";
chai.should();

import * as chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

describe("urlConverter", function() {
  it("should not convert absolute paths", function() {
    urlConverter("http://cdn.com", "http://google.com").should.equal("http://google.com");
  });

  it("should cdnify an image", function() {
    urlConverter("http://cdn.com", "face.jpg").should.equal("http://cdn.com/face.jpg");
  });

  it("should cdnify an image in a subdirectory", function() {
    urlConverter("http://cdn.com", "/dir/face.jpg").should.equal("http://cdn.com/dir/face.jpg");
  });

  describe("with a newUrlBase with a directory", function() {
    it("should preserve both the CDN and oldUrl directories", function() {
      urlConverter(
        "http://cdn.com/cdnDir/",
        "dir/face.jpg"
      ).should.equal("http://cdn.com/cdnDir/dir/face.jpg");
    });

    it("should assume the final path segment of the CDN URL is a dir", function() {
      urlConverter(
        "http://cdn.com/cdnDir",
        "dir/face.jpg"
      ).should.equal("http://cdn.com/cdnDir/dir/face.jpg");
    });
  });

  describe("and a pathOldUrlIsRelativeTo param specified", function() {
    it("should handle a directory", function() {
      urlConverter(
        "http://cdn.com/cdnDir",
        "secondDir/face.jpg",
        "firstDir/"
      ).should.equal("http://cdn.com/cdnDir/firstDir/secondDir/face.jpg");
    });
  });
});