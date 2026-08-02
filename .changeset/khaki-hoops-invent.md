---
"@altano/html-cdnify": major
---

replace `@gofunky/trumpet` (unmaintained) with `parse5-html-rewriting-stream`
(maintained)

The `@gofunky/trumpet` family (trumpet, `html-select2`, `cssauron-noeval`) was
last published in 2022 and every package in the chain are already at their final
version, so deprecated packages like `cssauron-noeval`'s have no upstream fix
coming. The HTML rewriting now runs on `parse5-html-rewriting-stream`, with
`css-select` for selector matching.

The observable contract is unchanged: unmatched markup passes through
byte-for-byte, and a matched start tag is re-serialized (internal whitespace
collapses, a self-closing `/` is dropped).

There are four known behavioral changes, and each change is a bug in trumpet
that isn't present in parse5:

- Character references in attribute values are preserved. trumpet re-encoded
  `&amp;` to `&amp;amp;`, corrupting query strings.
- Markup inside `<textarea>` is no longer rewritten. Its content is raw text,
  not markup.
- A duplicated attribute resolves to the first occurrence, per the HTML spec.
  trumpet used the last.
- Stray angle brackets at end of input survive. trumpet silently truncated
  `>>><<<` to `>>>`.

There may be more.

Selectors are now matched against each start tag individually, so combinators
(descendant, child, sibling) no longer match. Every selector this package ships
is element-local — a tag name plus attribute predicates, optionally negated
with `:not()` — so nothing built in is affected, but a caller passing a
combinator selector via `transformDefinitions` would be.
