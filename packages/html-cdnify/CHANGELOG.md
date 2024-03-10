# @altano/html-cdnify

## 2.0.0

### Major Changes

- caf9d8b: switch to @gofunky/trumpet

  The main trumpet library hasn't been updated in 8 years and has insecure dependencies. Let's switch to a more-recently updated version that passes a `pnpm audit`. I have no reason to think the public API of html-cdnify has changed as all tests pass, but I'm producing a major version just in case.

### Patch Changes

- 5fc1078: update dependencies
