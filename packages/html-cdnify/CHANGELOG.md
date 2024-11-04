# @altano/html-cdnify

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
