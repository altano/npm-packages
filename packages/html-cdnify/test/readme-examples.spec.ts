import { describe, test, expect } from "vitest";
import { cdnify, CDNTransformer } from "@altano/html-cdnify";

describe("README.md", function () {
  test("example 1", async () => {
    expect(
      await cdnify({
        cdnUrl: "//cdn.com",
        buffer: `<img src="/face.png">`,
      }).then((buffer) => buffer.toString()),
    ).toMatchInlineSnapshot(`"<img src="//cdn.com/face.png">"`);
  });
  test("example 2.1", async () => {
    const input = `
<img src="figure1.png">
<img src="articleSubDirectory/figure2.png">
<img src="/images/logo.png">
`.trim();
    expect(
      await cdnify({
        cdnUrl: "//cdn.com",
        bufferPath: "articles/article1/index.html",
        buffer: input,
      }).then((buffer) => buffer.toString()),
    ).toMatchInlineSnapshot(`
      "<img src="//cdn.com/articles/article1/figure1.png">
      <img src="//cdn.com/articles/article1/articleSubDirectory/figure2.png">
      <img src="//cdn.com/images/logo.png">"
    `);
  });
  test("example 2.2", async () => {
    const input = `
<img src="figure1.png">
<img src="articleSubDirectory/figure2.png">
<img src="/images/logo.png">
`.trim();
    expect(
      await cdnify({
        cdnUrl: "//cdn.com",
        buffer: input,
      }).then((buffer) => buffer.toString()),
    ).toMatchInlineSnapshot(`
      "<img src="//cdn.com/figure1.png">
      <img src="//cdn.com/articleSubDirectory/figure2.png">
      <img src="//cdn.com/images/logo.png">"
    `);
  });
  test("example 3", async () => {
    const input = `
<img src="figure1.png">
<img src="articleSubDirectory/figure2.png">
<img src="/images/logo.png">
    `.trim();
    expect(
      await cdnify({
        cdnUrl: "//cdn.com/sub/directory/in/cdn/is/always/present",
        bufferPath: "article/index.html",
        buffer: input,
      }).then((buffer) => buffer.toString()),
    ).toMatchInlineSnapshot(`
      "<img src="//cdn.com/sub/directory/in/cdn/is/always/present/article/figure1.png">
      <img src="//cdn.com/sub/directory/in/cdn/is/always/present/article/articleSubDirectory/figure2.png">
      <img src="//cdn.com/sub/directory/in/cdn/is/always/present/images/logo.png">"
    `);
  });
  test("example 4", async () => {
    expect(
      await cdnify({
        cdnUrl: "//cdn.com/cdn/",
        transformDefinitions: [
          {
            selector: "custom-element[src]",
            attribute: "src",
          },
        ],
        buffer: `<custom-element src="/face7.png">`,
      }).then((buffer) => buffer.toString()),
    ).toMatchInlineSnapshot(`"<custom-element src="//cdn.com/cdn/face7.png">"`);
  });
  test("example 5", async () => {
    expect(
      await cdnify({
        cdnUrl: "//cdn.com",
        transformFunction: (cdnUrl, oldUrl, bufferPath) => {
          return cdnUrl + "/subdir" + oldUrl;
        },
        buffer: `<img src="/logo.png">`,
      }).then((buffer) => buffer.toString()),
    ).toMatchInlineSnapshot(`"<img src="//cdn.com/subdir/logo.png">"`);
  });
  test("example 6", async () => {
    expect(
      await cdnify({
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
        buffer: `<img src="logo.png"><script src="main.js"></script>`,
      }).then((buffer) => buffer.toString()),
    ).toMatchInlineSnapshot(
      `"<img src="//imagecdn.com/logo.png"><script src="//assetcdn.com/main.js"></script>"`,
    );
  });
  test("example 7", async () => {
    expect(
      await cdnify({
        cdnUrl: "//cdn.com",
        transformDefinitions: [
          {
            selector: `img[src$="png"]`,
            attribute: "src",
            attributeParser: (oldAttribute, transformFunction) =>
              transformFunction(oldAttribute.toUpperCase()),
          },
        ],
        buffer: `<img src="/logo.gif"><img src="/logo.png">`,
      }).then((buffer) => buffer.toString()),
    ).toMatchInlineSnapshot(`"<img src="//cdn.com/logo.gif"><img src="//cdn.com/LOGO.PNG">"`);
  });
});
