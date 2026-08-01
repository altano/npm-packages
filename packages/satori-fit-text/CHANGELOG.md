# @altano/satori-fit-text

## 3.0.0

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

### Patch Changes

- 46e1795: update `astro` to 7.1.3, `svelte` to 5.56.7, `svgdom` to 0.1.28, and
  `typescript-eslint` to 8.65.0
- 4818735: update `tsdown` to 0.22, which builds the published `dist/` output
- 86f585d: update dependencies: `lodash`, `react-use`, `svgdom`, `@svgdotjs/svg.js`

## 2.0.2

### Patch Changes

- 72b15cc: update dependencies
- fb3c931: upgrade tsdown

## 2.0.1

### Patch Changes

- 1ab88a4: export source maps

## 2.0.0

### Major Changes

- 38c79ef: build with tsc

## 1.0.2

### Patch Changes

- 84df5fe: Improve text measurement algorithm, same (better) results as pre-1.0 version, but with less code.

## 1.0.1

### Patch Changes

- 093d296: update packages

  Addresses https://github.com/altano/npm-packages/security/dependabot/142

## 1.0.0

### Major Changes

- 7f7a26c: Update satori, includes major font-handling changes

### Patch Changes

- 4c2162f: remove unused dependencies

## 0.1.4

### Patch Changes

- 2266961: fix import extensions for node libraries

## 0.1.3

### Patch Changes

- b8bc683: build/test overhaul
  - consolidate on module exports
  - better build orchestration
  - more extensive testing (both unit and browser testing)

## 0.1.2

### Patch Changes

- 5fc1078: update dependencies

## 0.1.1

### Patch Changes

- f6c24e02: fix bug in browser

## 0.1.0

### Minor Changes

- d23df5db: web version + bug fixes

## 0.0.1

### Patch Changes

- c88d635c: new package for text fitting
