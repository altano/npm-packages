# remark-mdx-toc-with-slugs

## Summary

This is a [remark](https://remark.js.org/) plugin that exports a table of contents. It is similar to the [remark-mdx-toc](https://github.com/DCsunset/remark-mdx-toc) plugin but has an additional `slug` property.

Given this mdx:

```markdown
## Resource Acquisition Is Initialization (RAII)

### Is There a Problem?

### C++ Classes

### The Solution
```

`remark-mdx-toc-with-slugs` exports this object on the `toc` field:

```javascript
export const toc = [
  {
    depth: 2,
    value: "Resource Acquisition Is Initialization (RAII)",
    slug: "resource-acquisition-is-initialization-raii",
    attributes: {},
    children: [
      {
        depth: 3,
        value: "Is There a Problem?",
        attributes: {},
        children: [],
        slug: "is-there-a-problem",
      },
      {
        depth: 3,
        value: "C++ Classes",
        attributes: {},
        children: [],
        slug: "c-classes",
      },
      {
        depth: 3,
        value: "The Solution",
        attributes: {},
        children: [],
        slug: "the-solution",
      },
    ],
  },
];
```

## Options

- `name`: The exported variable name of the table of contents. By default, it's `toc`.

## Misc

- If you don't need the slug, consider using [remark-mdx-toc](https://github.com/DCsunset/remark-mdx-toc).
- Slugs are generated using [`github-slugger`](https://www.npmjs.com/package/github-slugger) and should therefore match the [`rehype-slug`](https://www.npmjs.com/package/rehype-slug) package
