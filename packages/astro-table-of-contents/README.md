# astro-table-of-contents

A set of Astro components to help you make a table of contents.

## TableOfContents.astro

Generate the markup for a table of contents from Astro's `headings` object.

### Getting the `headings` object from Astro

If you're importing your markdown directly ([documentation](https://docs.astro.build/en/guides/markdown-content/#importing-markdown)):

```astro
---
import {getHeadings} from "./Article.md";
const headings = getHeadings();
---
```

If you're using content collections ([documentation](https://docs.astro.build/en/guides/markdown-content/#markdown-from-content-collections-queries)):

```astro
---
import { getEntry } from "astro:content";
const article = await getEntry("articles", Astro.props.slug);
const { headings } = await article.render();
---
```

### Component Props

- `headings` (required) - The heading property from Astro-rendered markdown [an automatically-generated `headings` property](https://docs.astro.build/en/guides/markdown-content/#markdown-from-content-collections-queries).
- `class` (optional) - A class with styles to pass down to the `ul` in the table of contents
- `fromDepth` (optional) - A minimum depth for the table of contents, which defaults to 1 (i.e. include `h1` and above).
- `toDepth` (optional) - A maximum depth for the table of contents, which defaults to 6 (i.e. include `h6` and below).

### Example - Custom Heading Depths

```astro
---
import TableOfContents from "@altano/astro-table-of-contents/TableOfContents.astro";

const { headings } = await Astro.props.article.render();
---

<TableOfContents {headings} fromDepth={2} toDepth={5} />
```

This will only include `h2`-`h5` from `headings`.

### Example - Add Styling

```astro
---
import TableOfContents from "@altano/astro-table-of-contents/TableOfContents.astro";

const { headings } = await Astro.props.article.render();
---


<style>
  nav {
    position: sticky;
    top: 0;
    max-height: 100vh;
    overflow-y: auto;
  }

  .toc {
    a {
      color: orangered;
      /**
       * different color based on nav level
       */
      &[aria-level="2"] {
        color: blue;
      }
      &[aria-level="3"] {
        color: cyan;
      }
    }
  }
</style>


<nav>
  <TableOfContentsWithScrollSpy class="toc" {headings} />
</nav>
```

## Styling Based On Visibility

![Animation showing a page being scrolled from top-to-bottom, demonstrating the styling of links changing as the page scrolls down.](./assets/visibility-styling.avif)

To style elements of your table of contents differently depending on whether or not the target section is visible, e.g. color links differently when the link target is visible, you must:

1. Wrap your article with an `ArticleSectionVisibilityObserver.astro` component, and
2. Use `TableOfContentsWithScrollSpy.astro` for your table of contents.
3. Add styles that use the `aria-current` attribute, such as styling active anchors to be a different color or opacity.
4. Your content must be in sections. If you're using Markdown, you can automatically sectionize (based on headings) with the `remark-sectionize` plugin ([example](https://github.com/altano/alan.norbauer.com/blob/b0666f0f13cdf3688bed47286d6a8cfea548abd4/astro.config.ts#L38)).

e.g. your Astro component should look something like:

```astro
---
import ArticleSectionVisibilityObserver from "@altano/astro-table-of-contents/ArticleSectionVisibilityObserver.astro";
import TableOfContentsWithScrollSpy from "@altano/astro-table-of-contents/TableOfContentsWithScrollSpy.astro";

const { headings } = await Astro.props.article.render();
---

<style>
  .toc {
    a {
      color: inherit;
      /* Make links to invisible sections faded */
      opacity: 0.4;
      /**
       * The `aria-current` attribute is true when the anchor's target is
       * visible. Color such links orangered to make them stand out.
       */
      &[aria-current="true"] {
        opacity: 1;
        color: orangered;
      }
    }
  }
</style>

<div>
  <nav>
    <TableOfContentsWithScrollSpy {headings} class="toc" />
  </nav>
  <ArticleSectionVisibilityObserver>
    <article>
      <section>
        <h2>Heading 1</h2>
        ...
      </section>
      <section>
        <h2>Heading 2</h2>
        ...
      </section>
    </article>
  </ArticleSectionVisibilityObserver>
</div>
```

This uses a standard custom element (a web component) to monitor the visible article sections (using `IntersectionObserver`) and another standard custom element to set `aria-current=true` on anchor elements whose section is visible. The runtime (vanilla) JS added is very tiny, roughly 740 bytes (minified + gzipped). BYTES, not kilobytes.

## Live Demo

You can see these components in use on [my personal site](https://alan.norbauer.com/articles/browser-debugging-tricks/). The relevant source code for this site can be found [here](https://github.com/altano/alan.norbauer.com/blob/aeea9daa9d336682b4c794fa26cdfdd361ad4160/src/components/article/TableOfContents.astro#L63) [here](https://github.com/altano/alan.norbauer.com/blob/aeea9daa9d336682b4c794fa26cdfdd361ad4160/src/pages/articles/%5Bslug%5D/index.astro#L412) and [here](https://github.com/altano/alan.norbauer.com/blob/aeea9daa9d336682b4c794fa26cdfdd361ad4160/src/layouts/ArticleLayout.astro#L159).
