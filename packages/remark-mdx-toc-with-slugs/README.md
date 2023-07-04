# remark-mdx-toc-with-slugs

This is a [remark](https://remark.js.org/) preset that performs the same transform as [remark-mdx-toc](https://github.com/DCsunset/remark-mdx-toc) plugin but exports the table of contents with an additional `slug` property.

So `remark-mdx-toc` exports this object:

```javascript
[
  {
    depth: 2,
    value: "Resource Acquisition Is Initialization (RAII)",
    attributes: {},
    children: [
      {
        depth: 3,
        value: "Is There a Problem?",
        attributes: {},
        children: [],
      },
      {
        depth: 3,
        value: "C++ Classes",
        attributes: {},
        children: [],
      },
    ],
  },
];
```

And `remark-mdx-toc-with-slugs` modifies it to export this instead:

```javascript
[
  {
    depth: 2,
    value: "Resource Acquisition Is Initialization (RAII)",
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
    slug: "resource-acquisition-is-initialization-raii",
  },
];
```

If you don't need the slug, continue using [remark-mdx-toc](https://github.com/DCsunset/remark-mdx-toc).

Slugs are generated using [`github-slugger`](https://www.npmjs.com/package/github-slugger) and should therefore match the [`rehype-slug`](https://www.npmjs.com/package/rehype-slug) package
