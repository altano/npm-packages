---
"@altano/html-cdnify": major
---

drop the `stream-to-promise` dependency in favor of `node:stream/consumers`

`stream-to-promise` is deprecated by its author in favor of Node builtins.
`outputBufferPromise` now uses `buffer()` from `node:stream/consumers` and
returns the same `Promise<Buffer>` — the public API is unchanged.

This is a major only because `engines.node` moves from `>=5.10.1` to
`>=16.7.0`, which is when `node:stream/consumers` was added.
