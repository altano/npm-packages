import { describe, expect, it } from "vitest";
import { Readable } from "node:stream";
import { text } from "node:stream/consumers";
import { HtmlRewriteStream } from "../../src/HtmlRewriteStream.js";

/** Pipe `chunks` through a stream that rewrites `src` on every `img`. */
async function rewriteSrc(chunks: (string | Buffer)[]): Promise<string> {
  const stream = new HtmlRewriteStream();
  stream.selectAll("img[src]", (el) => {
    const src = el.getAttribute("src");
    if (typeof src === "string") el.setAttribute("src", `/cdn${src}`);
  });
  return text(Readable.from(chunks).pipe(stream));
}

describe("HtmlRewriteStream", () => {
  describe("passthrough fidelity", () => {
    it("leaves unmatched markup byte-for-byte identical", async () => {
      const html = `<html><p><div></div>>>>><<<<<<<</p></html>`;
      await expect(rewriteSrc([html])).resolves.toEqual(html);
    });

    it("preserves stray angle brackets at end of input", async () => {
      // `@gofunky/trumpet` silently truncated this to ">>>".
      await expect(rewriteSrc([">>><<<"])).resolves.toEqual(">>><<<");
    });

    it("does not rewrite markup inside a textarea", async () => {
      // textarea content is raw text, not markup. trumpet rewrote it.
      const html = `<textarea><img src="/no.png"></textarea>`;
      await expect(rewriteSrc([html])).resolves.toEqual(html);
    });

    it("does not rewrite markup inside a script", async () => {
      const html = `<script>var a = "<img src='/no.png'>";</script>`;
      await expect(rewriteSrc([html])).resolves.toEqual(html);
    });
  });

  describe("rewriting", () => {
    it("collapses whitespace in a rewritten start tag", async () => {
      await expect(
        rewriteSrc([`<img      src="/a.png"\n   alt="x"\n  >`]),
      ).resolves.toEqual(`<img src="/cdn/a.png" alt="x">`);
    });

    it("drops the self-closing marker on a rewritten tag", async () => {
      await expect(rewriteSrc([`<img src="/a.png" />`])).resolves.toEqual(
        `<img src="/cdn/a.png">`,
      );
    });

    it("preserves character references in attribute values", async () => {
      // trumpet double-escaped this to `&amp;amp;`, corrupting the URL.
      await expect(
        rewriteSrc([`<img src="/a.png?x=1&amp;y=2">`]),
      ).resolves.toEqual(`<img src="/cdn/a.png?x=1&amp;y=2">`);
    });

    it("keeps the first of a duplicated attribute, per spec", async () => {
      // trumpet used the last occurrence.
      await expect(
        rewriteSrc([`<img src="/a.png" src="/b.png">`]),
      ).resolves.toEqual(`<img src="/cdn/a.png">`);
    });

    it("adds an attribute that wasn't already present", async () => {
      const stream = new HtmlRewriteStream();
      stream.selectAll("img", (el) => {
        el.setAttribute("loading", "lazy");
      });
      await expect(
        text(Readable.from([`<img src="/a.png">`]).pipe(stream)),
      ).resolves.toEqual(`<img src="/a.png" loading="lazy">`);
    });

    it("leaves the tag untouched when removing an absent attribute", async () => {
      const stream = new HtmlRewriteStream();
      stream.selectAll("img", (el) => {
        el.removeAttribute("nope");
      });
      // Nothing changed, so the original bytes must survive verbatim.
      const html = `<img    src="/a.png"   />`;
      await expect(text(Readable.from([html]).pipe(stream))).resolves.toEqual(
        html,
      );
    });

    it("reports a valueless attribute as `true`, not an empty string", async () => {
      const stream = new HtmlRewriteStream();
      const seen: (string | true | undefined)[] = [];
      stream.selectAll("img", (el) => {
        seen.push(el.getAttribute("src"));
      });
      await text(Readable.from([`<img src><img src="x"><img>`]).pipe(stream));
      expect(seen).toEqual([true, "x", undefined]);
    });
  });

  describe("chunked input", () => {
    it("accepts Buffer chunks", async () => {
      await expect(
        rewriteSrc([Buffer.from(`<img src="/a.png">`)]),
      ).resolves.toEqual(`<img src="/cdn/a.png">`);
    });

    it("handles a tag split across chunk boundaries", async () => {
      await expect(rewriteSrc([`<img sr`, `c="/a.p`, `ng">`])).resolves.toEqual(
        `<img src="/cdn/a.png">`,
      );
    });

    it("handles a multi-byte character split across Buffer chunks", async () => {
      // "日" is 3 bytes in UTF-8; slicing mid-character would corrupt it if the
      // stream decoded each chunk independently with `.toString()`.
      const full = Buffer.from(`<p>日本語</p><img src="/a.png">`, "utf8");
      const cut = 4; // lands inside the first multi-byte character
      await expect(
        rewriteSrc([full.subarray(0, cut), full.subarray(cut)]),
      ).resolves.toEqual(`<p>日本語</p><img src="/cdn/a.png">`);
    });

    it("flushes a truncated multi-byte sequence at end of input", async () => {
      // Input ends mid-character. The decoder is still holding a partial
      // sequence when the stream ends; it must be flushed (as U+FFFD) rather
      // than silently dropped.
      const full = Buffer.from(`<p>日`, "utf8");
      const truncated = full.subarray(0, full.length - 1);
      await expect(rewriteSrc([truncated])).resolves.toEqual("<p>�");
    });
  });
});
