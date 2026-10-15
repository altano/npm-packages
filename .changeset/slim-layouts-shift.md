---
"@altano/astro-opengraph": minor
"@altano/satori-fit-text": minor
---

update `satori` to 0.55. Its layout engine changed (Taffy replaces Yoga) and it follows CSS defaults more closely, so rendered images can shift by a few pixels, and `findLargestUsableFontSize` can return a font size that differs by 1px.
