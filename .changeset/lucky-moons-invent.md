---
"@altano/satori-fit-text": major
"@altano/astro-opengraph": major
---

update `satori` to 0.29.0 (from 0.12.2)

This is a breaking change for consumers: both packages re-export satori's types
as part of their public API (`Font` and `SatoriOptions` respectively), and
satori is a `dependencies` entry rather than a peer, so a consumer sharing a
satori instance needs to move in step.

The motivating fix is [vercel/satori#738](https://github.com/vercel/satori/issues/738):
satori 0.28.1 and earlier read `process.env.SATORI_STANDALONE` at module scope,
which throws `process is not defined` as soon as the bundle is imported in a
browser. 0.29.0 removes that read, so `satori-fit-text` works in a browser
again without the `satori/standalone` build and its manual wasm loading.

Rendering output shifts very slightly (glyph-edge antialiasing and debug bbox
overlays); the committed image snapshots were regenerated.
