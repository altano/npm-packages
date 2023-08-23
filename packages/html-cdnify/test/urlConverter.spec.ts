import { describe, it, expect } from "vitest";
import urlConverter from "../src/urlConverter";

describe("urlConverter", function () {
  it("should not convert absolute paths", function () {
    expect(urlConverter("http://cdn.com", "http://google.com")).toEqual(
      "http://google.com",
    );
  });

  it("should cdnify an image", function () {
    expect(urlConverter("http://cdn.com", "face.jpg")).toEqual(
      "http://cdn.com/face.jpg",
    );
  });

  it("should cdnify an image in a subdirectory", function () {
    expect(urlConverter("http://cdn.com", "/dir/face.jpg")).toEqual(
      "http://cdn.com/dir/face.jpg",
    );
  });

  describe("with a newUrlBase with a directory", function () {
    it("should preserve both the CDN and oldUrl directories", function () {
      expect(urlConverter("http://cdn.com/cdnDir/", "dir/face.jpg")).toEqual(
        "http://cdn.com/cdnDir/dir/face.jpg",
      );
    });

    it("should assume the final path segment of the CDN URL is a dir", function () {
      expect(urlConverter("http://cdn.com/cdnDir", "dir/face.jpg")).toEqual(
        "http://cdn.com/cdnDir/dir/face.jpg",
      );
    });
  });

  describe("and a pathOldUrlIsRelativeTo param specified", function () {
    it("should handle a directory", function () {
      expect(
        urlConverter(
          "http://cdn.com/cdnDir",
          "secondDir/face.jpg",
          "firstDir/",
        ),
      ).toEqual("http://cdn.com/cdnDir/firstDir/secondDir/face.jpg");
    });
  });
});
