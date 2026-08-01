# @altano/astro-opengraph

## 2.0.0

### Major Changes

- 9f5d200: update `satori` to 0.29.0 (from 0.12.2)

  Fixes:

  - restores browser support: satori 0.28.1 and earlier read
    `process.env.SATORI_STANDALONE` at module scope, which throws `process is not
defined` as soon as the bundle is imported in a browser. 0.29.0 removes that
    read, so `satori-fit-text` works in a browser again. See
    [vercel/satori#738](https://github.com/vercel/satori/issues/738) for more info.

  Breaking Changes:

  - rendering output shifts very slightly (glyph-edge antialiasing and debug bbox
    overlays).

  Non-breaking Changes:

  - both packages re-export satori's types as part of their public API (`Font` and
    `SatoriOptions` respectively). `Font` is unchanged. `SatoriOptions` has one
    additive change: 0.29.0 adds `pointScaleFactor?: number` (this is
    backwards-compatible).

- 0a65ab2: upgrade to Astro v7

### Patch Changes

- 7a7219b: update `eslint-plugin-react-hooks` to v7, which turns the React Compiler
  diagnostics into lint rules. `LinkOrText` no longer builds its JSX inside a
  `try`/`catch` (the catch never saw render errors anyway) and
  `CopyImageUrlButton`'s timer ref is renamed so the new rules recognize it as a
  ref. No behavior change.
- 4818735: update `tsdown` to 0.22, which builds the published `dist/` output

## 1.0.1

### Patch Changes

- 2d1852b: Actually support Astro v6 (fix peer deps error)

## 1.0.0

### Major Changes

- 72b15cc: support astro v6

### Patch Changes

- 72b15cc: update dependencies
- fb3c931: upgrade tsdown

## 0.1.1

### Patch Changes

- 1ab88a4: export source maps

## 0.1.0

### Patch Changes

- 2360618: initial version

## 0.1.0-alpha.4

### Patch Changes

- 12931cb: misc fixes for alpha.4 release

## 0.1.0-alpha.3

### Minor Changes

- e459146: add `alt` prop to component, test exports, etc

## 0.0.1-alpha.2

### Patch Changes

- df924cf: actually publish files

## 0.0.1-alpha.1

### Patch Changes

- 601f204: initial version
