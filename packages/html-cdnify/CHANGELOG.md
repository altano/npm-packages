# @altano/html-cdnify

## 6.0.0

### Major Changes

- 5b2231b: replace `@gofunky/trumpet` (unmaintained) with `parse5-html-rewriting-stream`
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

- ede4b09: drop the `stream-to-promise` dependency in favor of `node:stream/consumers`

  `stream-to-promise` is deprecated by its author in favor of Node builtins.
  `outputBufferPromise` now uses `buffer()` from `node:stream/consumers` and
  returns the same `Promise<Buffer>` — the public API is unchanged.

  This is a major only because `engines.node` moves from `>=5.10.1` to
  `>=16.7.0`, which is when `node:stream/consumers` was added.

### Patch Changes

- 3447470: fix: switch from `lodash` to `lodash-es` to fix Node import (when not going
  through a bundler)

## 5.0.0

### Major Changes

- bfccc27: replace the deprecated legacy `url.resolve` with the WHATWG URL API.

  Resolution is otherwise unchanged for absolute, protocol-relative, and path-only
  CDN URLs, but there are two breaking differences in the URLs written into your
  output HTML:

  - **`../` segments are clamped at the buffer root.** Previously a `../` that
    walked above the root was carried into the CDN URL and ate into the CDN base
    directory, so `http://cdn.com/cdnDir/` + `../../face.jpg` resolved to
    `http://cdn.com/face.jpg`. It now resolves to
    `http://cdn.com/cdnDir/face.jpg`. That escape contradicted the documented
    intent that the CDN base directory is always preserved.

  - **Path segments are percent-encoded per the URL spec.** Non-ASCII characters
    are now escaped (`café.jpg` becomes `caf%C3%A9.jpg`), and characters the URL
    spec permits in a path are no longer escaped (`a|b.jpg` stays `a|b.jpg`
    instead of becoming `a%7Cb.jpg`). Browsers resolve both spellings identically,
    so this changes the bytes in your HTML rather than what they point at. Input
    that is already percent-encoded is passed through untouched.

  One much smaller difference, for malformed input only: a backslash-prefixed URL
  (`\face.jpg`) resolved against a relative CDN base used to keep a leading slash
  and is now fully relative. Note that a backslash-prefixed URL still escapes the
  CDN base directory, as it did before — the leading-slash guard doesn't recognize
  a backslash as a path separator, though the URL spec does.

### Patch Changes

- 4818735: update `tsdown` to 0.22, which builds the published `dist/` output
- 86f585d: update dependencies: `lodash`, `react-use`, `svgdom`, `@svgdotjs/svg.js`

## 4.0.2

### Patch Changes

- 72b15cc: update dependencies
- fb3c931: upgrade tsdown

## 4.0.1

### Patch Changes

- 1ab88a4: export source maps

## 4.0.0

### Major Changes

- 38c79ef: build with tsc

## 3.0.5

### Patch Changes

- 8743821: stop double exporting

## 3.0.4

### Patch Changes

- 1cdc0fe: make types compatible with typescript's exactOptionalPropertyTypes
- 4c2162f: remove unused dependencies

## 3.0.3

### Patch Changes

- 2750b66: - only merge transformDefinitions in options if both values are transformDefinition, not just one of the values
  - fix error messages for invalid options

## 3.0.2

### Patch Changes

- 6a7f8c8: minor change to improve code test coverage

## 3.0.1

### Patch Changes

- 2266961: fix import extensions for node libraries

## 3.0.0

### Major Changes

- b8bc683: build/test overhaul
  - consolidate on module exports
  - better build orchestration
  - more extensive testing (both unit and browser testing)

## 2.0.0

### Major Changes

- caf9d8b: switch to @gofunky/trumpet

  The main trumpet library hasn't been updated in 8 years and has insecure dependencies. Let's switch to a more-recently updated version that passes a `pnpm audit`. I have no reason to think the public API of html-cdnify has changed as all tests pass, but I'm producing a major version just in case.

### Patch Changes

- 5fc1078: update dependencies
