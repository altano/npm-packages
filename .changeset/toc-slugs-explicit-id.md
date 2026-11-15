---
"@altano/remark-mdx-toc-with-slugs": patch
---

use a JSX heading's `id` attribute as its `slug`, such as `setup` for `<h2 id="setup">`, and no longer count its text toward duplicate slugs, so a later heading with the same text no longer gets a `-1` suffix that its rendered id lacks (#392)
