---
"@altano/vitest-plugins": major
---

BREAKING: require vitest 5 (the `vitest` peer dependency is now `5.x.x`). The custom matchers' types now extend vitest's `Matchers<R, T>` instead of `Assertion<T>`, as vitest 5 requires.
