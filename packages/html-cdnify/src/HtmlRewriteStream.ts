import { RewritingStream } from "parse5-html-rewriting-stream";
import { Element } from "domhandler";
import { compile } from "css-select";
import { StringDecoder } from "node:string_decoder";
import type { Element as DomElement } from "domhandler";

/**
 * css-select's own `CompiledQuery` isn't re-exported from its entry point, but
 * it is structurally just a predicate over a node.
 */
type CompiledSelector = (node: DomElement) => boolean;

/**
 * The subset of a DOM element that transforms are allowed to touch.
 *
 * `getAttribute` reports a valueless attribute (`<img data-cdn-ignore>`) as
 * `true` rather than `""`, so callers can tell it apart from an attribute
 * holding a real value.
 */
export interface SelectedElement {
  getAttribute(name: string): string | true | undefined;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
}

export type SelectionHandler = (element: SelectedElement) => void;

interface Selection {
  match: CompiledSelector;
  handler: SelectionHandler;
}

/**
 * An HTML-in, HTML-out transform stream that rewrites attributes on elements
 * matching a CSS selector.
 *
 * Anything the selectors don't match passes through byte-for-byte; a matched
 * start tag is re-serialized, so its internal whitespace collapses and a
 * self-closing `/` is dropped. That asymmetry is deliberate — it reproduces the
 * observable behavior of `@gofunky/trumpet`, which this replaced.
 *
 * Selectors are evaluated against each start tag on its own, so combinators
 * (descendant, child, sibling) will not match. Every selector this package
 * ships, and every selector its tests exercise, is element-local: a tag name
 * plus attribute predicates, optionally negated with `:not()`.
 */
export class HtmlRewriteStream extends RewritingStream {
  readonly #selections: Selection[] = [];
  readonly #decoder = new StringDecoder("utf8");

  constructor() {
    super();

    this.on("startTag", (token, raw) => {
      let dirty = false;

      const element: SelectedElement = {
        getAttribute(name) {
          const attr = token.attrs.find((a) => a.name === name);
          if (attr == null) {
            return undefined;
          }
          return attr.value === "" ? true : attr.value;
        },
        setAttribute(name, value) {
          const attr = token.attrs.find((a) => a.name === name);
          if (attr) {
            attr.value = value;
          } else {
            token.attrs.push({ name, value });
          }
          dirty = true;
        },
        removeAttribute(name) {
          const before = token.attrs.length;
          token.attrs = token.attrs.filter((a) => a.name !== name);
          if (token.attrs.length !== before) {
            dirty = true;
          }
        },
      };

      // css-select needs a domhandler node. Building a throwaway one per start
      // tag keeps this independent of any parse tree.
      const node = new Element(
        token.tagName,
        Object.fromEntries(token.attrs.map((a) => [a.name, a.value])),
      );

      for (const { match, handler } of this.#selections) {
        if (match(node)) handler(element);
      }

      if (dirty) {
        // trumpet emitted `<img>` for `<img />`; parse5 would keep the marker.
        token.selfClosing = false;
        this.emitStartTag(token);
      } else {
        // Untouched tags go out exactly as they came in, quirks and all.
        this.emitRaw(raw);
      }
    });
  }

  /**
   * Register a handler to run against every element matching `selector`.
   * Must be called before any data is written to the stream.
   */
  selectAll(selector: string, handler: SelectionHandler): void {
    this.#selections.push({ match: compile(selector), handler });
  }

  /**
   * parse5's parser accepts only strings, but callers pipe Buffers in. Decode
   * through a StringDecoder rather than `chunk.toString()`, so a multi-byte
   * character split across two chunks survives the boundary.
   */
  override _transform(
    chunk: string | Buffer,
    encoding: string,
    callback: (error?: Error | null, data?: string) => void,
  ): void {
    const text = typeof chunk === "string" ? chunk : this.#decoder.write(chunk);
    super._transform(text, encoding, callback);
  }

  override _final(
    callback: (error?: Error | null, data?: string) => void,
  ): void {
    // Anything the decoder is still holding is an incomplete sequence at end
    // of input; `end()` turns it into replacement characters. Push it through
    // the parser before finishing rather than dropping it.
    const rest = this.#decoder.end();
    if (rest !== "") this.push(this._transformChunk(rest));
    super._final(callback);
  }
}
