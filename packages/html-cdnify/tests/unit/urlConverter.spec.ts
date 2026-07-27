import { describe, it, expect } from "vitest";
import urlConverter from "../../src/urlConverter.js";

/**
 * The expectations below were captured from the previous implementation, which
 * resolved URLs with the deprecated, legacy `url.resolve`. This makes sure that
 * we maintain the existing behavior while moving to the WHATWG URL API.
 *
 * The two places where behavior intentionally diverges are noted with
 * "DIVERGENCE" in the comments below.
 */
describe("urlConverter", function () {
  describe("non-local URLs", function () {
    it.each([
      { oldUrl: "http://google.com", why: "an absolute URL" },
      { oldUrl: "//other.com/face.jpg", why: "a protocol-relative URL" },
      { oldUrl: "data:image/png;base64,abc", why: "a data URL" },
      { oldUrl: "", why: "an empty string" },
    ])("should not convert $why", function ({ oldUrl }) {
      expect(urlConverter("http://cdn.com", oldUrl)).toEqual(oldUrl);
    });
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

    it("should preserve a deep CDN directory", function () {
      expect(urlConverter("https://cdn.com/a/b/", "face.jpg")).toEqual(
        "https://cdn.com/a/b/face.jpg",
      );
    });
  });

  // `new URL()` can't parse these bases on its own, so they take a different
  // code path than a fully absolute newUrlBase.
  describe("with a protocol-relative newUrlBase", function () {
    it.each([
      {
        newUrlBase: "//cdn.com",
        oldUrl: "face.jpg",
        expected: "//cdn.com/face.jpg",
      },
      {
        newUrlBase: "//cdn.com/",
        oldUrl: "face.jpg",
        expected: "//cdn.com/face.jpg",
      },
      {
        newUrlBase: "//cdn.com/cdn/",
        oldUrl: "dir/face.jpg",
        expected: "//cdn.com/cdn/dir/face.jpg",
      },
      {
        newUrlBase: "//cdn.com/sub/directory/in/cdn",
        oldUrl: "face.jpg",
        expected: "//cdn.com/sub/directory/in/cdn/face.jpg",
      },
    ])(
      "should keep the URL protocol-relative: $newUrlBase + $oldUrl",
      function ({ newUrlBase, oldUrl, expected }) {
        expect(urlConverter(newUrlBase, oldUrl)).toEqual(expected);
      },
    );

    it("should resolve against pathOldUrlIsRelativeTo first", function () {
      expect(
        urlConverter("//cdn.com/cdn/", "dir/face.jpg", "firstDir/"),
      ).toEqual("//cdn.com/cdn/firstDir/dir/face.jpg");
    });
  });

  describe("with a path-only newUrlBase", function () {
    it.each([
      {
        newUrlBase: "/static/",
        oldUrl: "face.jpg",
        expected: "/static/face.jpg",
      },
      {
        newUrlBase: "/static",
        oldUrl: "dir/face.jpg",
        expected: "/static/dir/face.jpg",
      },
      {
        newUrlBase: "static/",
        oldUrl: "face.jpg",
        expected: "static/face.jpg",
      },
    ])(
      "should not invent an origin: $newUrlBase + $oldUrl",
      function ({ newUrlBase, oldUrl, expected }) {
        expect(urlConverter(newUrlBase, oldUrl)).toEqual(expected);
      },
    );

    it("should resolve against pathOldUrlIsRelativeTo first", function () {
      expect(urlConverter("/static/", "dir/face.jpg", "firstDir/")).toEqual(
        "/static/firstDir/dir/face.jpg",
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

    it.each([
      {
        relativeTo: "firstDir/index.html",
        expected: "http://cdn.com/cdnDir/firstDir/face.jpg",
      },
      {
        relativeTo: "firstDir/second/index.html",
        expected: "http://cdn.com/cdnDir/firstDir/second/face.jpg",
      },
    ])(
      "should use the containing directory of a file: $relativeTo",
      function ({ relativeTo, expected }) {
        expect(
          urlConverter("http://cdn.com/cdnDir", "face.jpg", relativeTo),
        ).toEqual(expected);
      },
    );

    it.each([{ relativeTo: "." }, { relativeTo: "./" }])(
      "should treat $relativeTo as the buffer root",
      function ({ relativeTo }) {
        expect(
          urlConverter("http://cdn.com/cdnDir", "face.jpg", relativeTo),
        ).toEqual("http://cdn.com/cdnDir/face.jpg");
      },
    );

    it("should ignore it for a root-relative oldUrl", function () {
      expect(
        urlConverter("http://cdn.com/cdnDir", "/rooted/face.jpg", "firstDir/"),
      ).toEqual("http://cdn.com/cdnDir/rooted/face.jpg");
    });

    it.each([
      { oldUrl: "./face.jpg" },
      { oldUrl: "sub/../face.jpg" },
      { oldUrl: "  face.jpg  " },
    ])("should normalize $oldUrl", function ({ oldUrl }) {
      expect(
        urlConverter("http://cdn.com/cdnDir", oldUrl, "firstDir/"),
      ).toEqual("http://cdn.com/cdnDir/firstDir/face.jpg");
    });

    it("should walk up out of a nested directory", function () {
      expect(
        urlConverter(
          "http://cdn.com/cdnDir/",
          "../face.jpg",
          "firstDir/second/",
        ),
      ).toEqual("http://cdn.com/cdnDir/firstDir/face.jpg");
    });

    it.each([
      { oldUrl: "face.jpg?v=1", expected: "face.jpg?v=1" },
      { oldUrl: "face.jpg#frag", expected: "face.jpg#frag" },
      { oldUrl: "a b.jpg", expected: "a%20b.jpg" },
      { oldUrl: "%20odd.jpg", expected: "%20odd.jpg" },
    ])("should preserve $oldUrl", function ({ oldUrl, expected }) {
      expect(
        urlConverter("http://cdn.com/cdnDir", oldUrl, "firstDir/"),
      ).toEqual(`http://cdn.com/cdnDir/firstDir/${expected}`);
    });
  });

  // *DIVERGENCE from prior implementation*
  //
  // The CDN base directory is always preserved, per the "always use a relative
  // URL" rule in urlConverter. The legacy `url.resolve` implementation let a
  // `..` that walked above the buffer root leak through and eat into the CDN
  // directory; the WHATWG URL API clamps it at the root instead.
  describe("when oldUrl walks above the buffer root", function () {
    it.each([
      { oldUrl: "../face.jpg", relativeTo: "firstDir/" },
      { oldUrl: "../../face.jpg", relativeTo: "firstDir/" },
      { oldUrl: "../face.jpg", relativeTo: "." },
    ])(
      "should clamp $oldUrl relative to $relativeTo",
      function ({ oldUrl, relativeTo }) {
        expect(
          urlConverter("http://cdn.com/cdnDir/", oldUrl, relativeTo),
        ).toEqual("http://cdn.com/cdnDir/face.jpg");
      },
    );
  });

  // *DIVERGENCE from prior implementation*
  //
  // The other place the WHATWG URL API intentionally diverges from legacy
  // `url.resolve`. `new URL()` normalizes the path per the URL spec, which
  // escapes more than `url.resolve` did in some places and less in others.
  // Browsers resolve both spellings identically, so this only changes the bytes
  // written into the output HTML.
  describe("percent encoding", function () {
    // `url.resolve` passed non-ASCII through untouched.
    describe("non-ASCII characters", function () {
      it.each([
        {
          newUrlBase: "http://cdn.com/cdnDir",
          expected: "http://cdn.com/cdnDir/caf%C3%A9.jpg",
        },
        {
          newUrlBase: "//cdn.com/cdn/",
          expected: "//cdn.com/cdn/caf%C3%A9.jpg",
        },
        { newUrlBase: "/static/", expected: "/static/caf%C3%A9.jpg" },
        { newUrlBase: "static/", expected: "static/caf%C3%A9.jpg" },
      ])(
        "should escape them for $newUrlBase",
        function ({ newUrlBase, expected }) {
          expect(urlConverter(newUrlBase, "café.jpg")).toEqual(expected);
        },
      );

      it.each([
        {
          oldUrl: "日本語/画像.png",
          expected: "%E6%97%A5%E6%9C%AC%E8%AA%9E/%E7%94%BB%E5%83%8F.png",
        },
        { oldUrl: "emoji-\u{1f389}.jpg", expected: "emoji-%F0%9F%8E%89.jpg" },
      ])("should escape multi-byte $oldUrl", function ({ oldUrl, expected }) {
        expect(urlConverter("http://cdn.com/cdnDir", oldUrl)).toEqual(
          `http://cdn.com/cdnDir/${expected}`,
        );
      });

      it.each([{ relativeTo: "café/" }, { relativeTo: "café/index.html" }])(
        "should escape them in pathOldUrlIsRelativeTo: $relativeTo",
        function ({ relativeTo }) {
          expect(
            urlConverter("http://cdn.com/cdnDir", "face.jpg", relativeTo),
          ).toEqual("http://cdn.com/cdnDir/caf%C3%A9/face.jpg");
        },
      );

      it("should not double-encode input that is already escaped", function () {
        expect(urlConverter("http://cdn.com/cdnDir", "caf%C3%A9.jpg")).toEqual(
          "http://cdn.com/cdnDir/caf%C3%A9.jpg",
        );
      });
    });

    // The URL spec allows these in a path, so `new URL()` leaves them raw where
    // `url.resolve` escaped them.
    it.each([
      {
        newUrlBase: "http://cdn.com/cdnDir",
        expected: "http://cdn.com/cdnDir",
      },
      { newUrlBase: "//cdn.com/cdn/", expected: "//cdn.com/cdn" },
      { newUrlBase: "static/", expected: "static" },
    ])(
      "should no longer escape a pipe for $newUrlBase",
      function ({ newUrlBase, expected }) {
        expect(urlConverter(newUrlBase, "a|b.jpg")).toEqual(
          `${expected}/a|b.jpg`,
        );
      },
    );

    it.each([
      { oldUrl: "a b.jpg", expected: "a%20b.jpg" },
      { oldUrl: "A^B.jpg", expected: "A%5EB.jpg" },
      { oldUrl: "a{b}.jpg", expected: "a%7Bb%7D.jpg" },
      { oldUrl: "a`b.jpg", expected: "a%60b.jpg" },
      { oldUrl: 'a"b.jpg', expected: "a%22b.jpg" },
      { oldUrl: "a<b>.jpg", expected: "a%3Cb%3E.jpg" },
    ])("should still escape $oldUrl", function ({ oldUrl, expected }) {
      expect(urlConverter("http://cdn.com/cdnDir", oldUrl)).toEqual(
        `http://cdn.com/cdnDir/${expected}`,
      );
    });

    it.each([
      { oldUrl: "%20odd.jpg" },
      { oldUrl: "a%2Fb.jpg" },
      // Must stay encoded: decoding these would turn them into path traversal.
      { oldUrl: "..%2F..%2F" },
      { oldUrl: "%2E%2E%2F" },
    ])("should leave $oldUrl untouched", function ({ oldUrl }) {
      expect(urlConverter("http://cdn.com/cdnDir", oldUrl)).toEqual(
        `http://cdn.com/cdnDir/${oldUrl}`,
      );
    });
  });

  // Pre-existing, not something the WHATWG switch introduced: `url.resolve`
  // escaped the CDN directory here too. The leading-slash guard in urlConverter
  // only looks for `/`, but a backslash is a path separator for special
  // schemes, so a leading one reaches the CDN resolve still looking relative
  // and walks to the root. The one thing that did change is the bare relative
  // newUrlBase, which used to keep a leading slash and is now fully relative.
  describe("a backslash-prefixed oldUrl", function () {
    it.each([
      {
        newUrlBase: "http://cdn.com/cdnDir",
        expected: "http://cdn.com/face.jpg",
      },
      { newUrlBase: "//cdn.com/cdn/", expected: "//cdn.com/face.jpg" },
      { newUrlBase: "/static/", expected: "/face.jpg" },
      // `url.resolve` returned "/face.jpg" here.
      { newUrlBase: "static/", expected: "face.jpg" },
    ])(
      "should escape the CDN directory for $newUrlBase",
      function ({ newUrlBase, expected }) {
        expect(urlConverter(newUrlBase, "\\face.jpg")).toEqual(expected);
      },
    );

    it("should treat a non-leading backslash as a separator", function () {
      expect(urlConverter("http://cdn.com/cdnDir", "dir\\face.jpg")).toEqual(
        "http://cdn.com/cdnDir/dir/face.jpg",
      );
    });
  });

  // Degenerate input. Worth pinning down because the path-only branch of
  // resolveUrl unconditionally strips a leading slash, so it can return "".
  describe("a bare '/' oldUrl", function () {
    it.each([
      {
        newUrlBase: "http://cdn.com/cdnDir",
        expected: "http://cdn.com/cdnDir/",
      },
      { newUrlBase: "static/", expected: "static/" },
      { newUrlBase: ".", expected: "" },
    ])(
      "$newUrlBase should resolve to $expected",
      function ({ newUrlBase, expected }) {
        expect(urlConverter(newUrlBase, "/")).toEqual(expected);
      },
    );
  });
});
