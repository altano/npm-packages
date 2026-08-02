/**
 * Every example the README documents, asserted end to end.
 *
 * The point is to keep the docs honest: if one of these fails, the README is
 * lying to somebody. Some cases overlap with the other specs; that's fine — the
 * duplication is what ties a documented promise to a verified one.
 */
import { describe, expect, it } from "vitest";
import streamifier from "streamifier";
import { text } from "node:stream/consumers";
import { cdnify } from "../../src/cdnify.js";
import { CDNTransformer } from "../../src/CDNTransformer.js";

async function run(
  options: Omit<Parameters<typeof cdnify>[0], "buffer">,
  buffer: string,
): Promise<string> {
  return (await cdnify({ ...options, buffer })).toString();
}

describe("README", () => {
  it("Simplest usage", async () => {
    await expect(
      run({ cdnUrl: "//cdn.com" }, `<img src="/face.png">`),
    ).resolves.toEqual(`<img src="//cdn.com/face.png">`);
  });

  describe("What gets cdnified", () => {
    const cases: [label: string, input: string, output: string][] = [
      [
        `<img data-src>`,
        `<img data-src="/a.png">`,
        `<img data-src="//cdn.com/a.png">`,
      ],
      [`<img src>`, `<img src="/a.png">`, `<img src="//cdn.com/a.png">`],
      [
        `<img srcset>`,
        `<img srcset="/a.png 1x,/b.png 2x">`,
        `<img srcset="//cdn.com/a.png 1x,//cdn.com/b.png 2x">`,
      ],
      [
        `<video poster>`,
        `<video poster="/p.jpg"></video>`,
        `<video poster="//cdn.com/p.jpg"></video>`,
      ],
      [
        `<script src>`,
        `<script src="/s.js"></script>`,
        `<script src="//cdn.com/s.js"></script>`,
      ],
      [
        `<source src>`,
        `<source src="/v.mp4">`,
        `<source src="//cdn.com/v.mp4">`,
      ],
      [
        `<link rel="apple-touch-icon">`,
        `<link rel="apple-touch-icon" href="/t.png">`,
        `<link rel="apple-touch-icon" href="//cdn.com/t.png">`,
      ],
      [
        `<link rel="icon">`,
        `<link rel="icon" href="/i.png">`,
        `<link rel="icon" href="//cdn.com/i.png">`,
      ],
      [
        `<link rel="shortcut icon">`,
        `<link rel="shortcut icon" href="/f.ico">`,
        `<link rel="shortcut icon" href="//cdn.com/f.ico">`,
      ],
      [
        `<link rel="stylesheet">`,
        `<link rel="stylesheet" href="/m.css">`,
        `<link rel="stylesheet" href="//cdn.com/m.css">`,
      ],
    ];

    for (const [label, input, output] of cases) {
      it(`cdnifies ${label}`, async () => {
        await expect(run({ cdnUrl: "//cdn.com" }, input)).resolves.toEqual(
          output,
        );
      });
    }
  });

  describe("Won't be cdnified", () => {
    it("leaves an absolute URL alone", async () => {
      const html = `<img src="http://foo.com/logo.png">`;
      await expect(run({ cdnUrl: "//cdn.com" }, html)).resolves.toEqual(html);
    });

    it("leaves a scheme-relative URL alone", async () => {
      const html = `<img src="//foo.com/logo.png">`;
      await expect(run({ cdnUrl: "//cdn.com" }, html)).resolves.toEqual(html);
    });

    it("leaves an attribute that isn't among those cdnified", async () => {
      const html = `<img custom="/logo.png">`;
      await expect(run({ cdnUrl: "//cdn.com" }, html)).resolves.toEqual(html);
    });
  });

  it("skips, and strips, data-cdn-ignore", async () => {
    await expect(
      run({ cdnUrl: "//cdn.com" }, `<img src="/a.png" data-cdn-ignore>`),
    ).resolves.toEqual(`<img src="/a.png">`);
  });

  describe("bufferPath", () => {
    const input = `<img src="figure1.png">\n<img src="articleSubDirectory/figure2.png">\n<img src="/images/logo.png">`;

    it("resolves relative URLs against the buffer's directory", async () => {
      await expect(
        run(
          { cdnUrl: "//cdn.com", bufferPath: "articles/article1/index.html" },
          input,
        ),
      ).resolves.toEqual(
        `<img src="//cdn.com/articles/article1/figure1.png">\n` +
          `<img src="//cdn.com/articles/article1/articleSubDirectory/figure2.png">\n` +
          `<img src="//cdn.com/images/logo.png">`,
      );
    });

    it("assumes the domain root when bufferPath is omitted", async () => {
      await expect(run({ cdnUrl: "//cdn.com" }, input)).resolves.toEqual(
        `<img src="//cdn.com/figure1.png">\n` +
          `<img src="//cdn.com/articleSubDirectory/figure2.png">\n` +
          `<img src="//cdn.com/images/logo.png">`,
      );
    });

    it("always keeps a CDN subdirectory in the result", async () => {
      await expect(
        run(
          {
            cdnUrl: "//cdn.com/sub/directory/in/cdn/is/always/present",
            bufferPath: "article/index.html",
          },
          input,
        ),
      ).resolves.toEqual(
        `<img src="//cdn.com/sub/directory/in/cdn/is/always/present/article/figure1.png">\n` +
          `<img src="//cdn.com/sub/directory/in/cdn/is/always/present/article/articleSubDirectory/figure2.png">\n` +
          `<img src="//cdn.com/sub/directory/in/cdn/is/always/present/images/logo.png">`,
      );
    });
  });

  it("Using the underlying stream instead of a Promise", async () => {
    const transformer = new CDNTransformer({ cdnUrl: "http://cdn.com" });
    const outputStream = streamifier
      .createReadStream(
        `<img src="face1.png">\n<img src="face2.png">\n<img src="face3.png">`,
      )
      .pipe(transformer.stream);

    await expect(text(outputStream)).resolves.toEqual(
      `<img src="http://cdn.com/face1.png">\n` +
        `<img src="http://cdn.com/face2.png">\n` +
        `<img src="http://cdn.com/face3.png">`,
    );
  });

  it("adds <custom-element src> via transformDefinitions", async () => {
    await expect(
      run(
        {
          cdnUrl: "//cdn.com/cdn/",
          transformDefinitions: [
            { selector: "custom-element[src]", attribute: "src" },
          ],
        },
        `<custom-element src="/face7.png">`,
      ),
    ).resolves.toEqual(`<custom-element src="//cdn.com/cdn/face7.png">`);
  });

  it("Specifying a custom transform function", async () => {
    await expect(
      run(
        {
          cdnUrl: "//cdn.com",
          transformFunction: (cdnUrl, oldUrl) => `${cdnUrl}/subdir${oldUrl}`,
        },
        `<img src="/logo.png">`,
      ),
    ).resolves.toEqual(`<img src="//cdn.com/subdir/logo.png">`);
  });

  it("custom transform function that delegates to the default", async () => {
    await expect(
      run(
        {
          cdnUrl: "//cdn.com",
          transformFunction: (_cdnUrl, oldUrl, bufferPath) =>
            CDNTransformer.defaultTransformFunction(
              oldUrl.endsWith(".png") ? "//imagecdn.com" : "//assetcdn.com",
              oldUrl,
              bufferPath,
            ),
        },
        `<img src="logo.png"><script src="main.js"></script>`,
      ),
    ).resolves.toEqual(
      `<img src="//imagecdn.com/logo.png"><script src="//assetcdn.com/main.js"></script>`,
    );
  });

  it("Specifying a custom attributeParser", async () => {
    await expect(
      run(
        {
          cdnUrl: "//cdn.com",
          transformDefinitions: [
            {
              selector: `img[src$="png"]`,
              attribute: "src",
              attributeParser: (oldAttribute, transformFunction) =>
                transformFunction(oldAttribute.toUpperCase()),
            },
          ],
        },
        `<img src="/logo.gif"><img src="/logo.png">`,
      ),
    ).resolves.toEqual(
      `<img src="//cdn.com/logo.gif"><img src="//cdn.com/LOGO.PNG">`,
    );
  });

  it("Overriding an existing transform", async () => {
    await expect(
      run(
        {
          cdnUrl: "//cdn.com",
          transformDefinitions: [
            {
              selector: "img[src]:not([data-cdn-ignore])",
              attribute: "src",
              attributeParser: (oldAttribute) => oldAttribute,
            },
          ],
        },
        `<img src="logo.gif">`,
      ),
    ).resolves.toEqual(`<img src="logo.gif">`);
  });

  describe("Selector support", () => {
    // `transformDefinitions` are merged with the built-in ones, so these use
    // <custom-element>, which no default transform touches. Otherwise a
    // default rule would do the work and the assertion would prove nothing.
    const html = `<div><p></p><custom-element src="/a.png"></custom-element></div>`;
    const cdnified = `<div><p></p><custom-element src="//cdn.com/a.png"></custom-element></div>`;

    const supported = [
      `custom-element`,
      `*[src]`,
      `custom-element[src]`,
      `custom-element[src="/a.png"]`,
      `custom-element[src$="png"]`,
      `custom-element:not([data-cdn-ignore])`,
    ];

    for (const selector of supported) {
      it(`supports \`${selector}\``, async () => {
        await expect(
          run(
            {
              cdnUrl: "//cdn.com",
              transformDefinitions: [{ selector, attribute: "src" }],
            },
            html,
          ),
        ).resolves.toEqual(cdnified);
      });
    }

    // Documented limitation: combinators reach outside the start tag, which is
    // all the streaming matcher can see. They never match, and never throw.
    const unsupported = [
      `div custom-element`,
      `div > custom-element`,
      `p + custom-element`,
    ];

    for (const selector of unsupported) {
      it(`silently never matches \`${selector}\``, async () => {
        await expect(
          run(
            {
              cdnUrl: "//cdn.com",
              transformDefinitions: [{ selector, attribute: "src" }],
            },
            html,
          ),
        ).resolves.toEqual(html);
      });
    }
  });
});
