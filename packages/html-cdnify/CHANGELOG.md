# @altano/html-cdnify

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
