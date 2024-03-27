import { describe, it, expect } from "vitest";
import { cdnify, type CdnifyOptions } from "@altano/html-cdnify";

describe("cdnify", function () {
  it("should conveniently wrap CDNTransformer", async function () {
    const cdnifyOptions: CdnifyOptions = {
      cdnUrl: "//cdn.alan.norbauer.com/cdn/",
      bufferPath: "test.html",
      buffer: Buffer.from(
        `<html><img src="/face.png" data-cdn-ignore><img src="/face.png"></html>`,
      ),
    };

    const result = cdnify(cdnifyOptions).then((buffer) => buffer.toString());
    await expect(result).resolves.toEqual(
      `<html><img src="/face.png"><img src="//cdn.alan.norbauer.com/cdn/face.png"></html>`,
    );
  });
});
