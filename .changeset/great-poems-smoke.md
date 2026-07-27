---
"@altano/astro-opengraph": patch
---

update `eslint-plugin-react-hooks` to v7, which turns the React Compiler
diagnostics into lint rules. `LinkOrText` no longer builds its JSX inside a
`try`/`catch` (the catch never saw render errors anyway) and
`CopyImageUrlButton`'s timer ref is renamed so the new rules recognize it as a
ref. No behavior change.
