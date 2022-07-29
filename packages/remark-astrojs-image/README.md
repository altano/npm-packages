> ⚠️ **HIGHLY EXPERIMENTAL**: Everything about this package is subject to change, including the name.

# remark-astrojs-image

This is a [remark](https://remark.js.org/) preset that enhances images in your [.mdx files](https://docs.astro.build/en/guides/integrations-guide/mdx/) to use [`@astrojs/image` components](https://docs.astro.build/en/guides/integrations-guide/image/). While this preset (and accompanying remark plugins) are not astro specific, if you're not using mdx in an [astro site](https://astro.build) you probably shouldn't be here.

## Functionality

| Feature                  | Before                                          | After                                                  |
| ------------------------ | ----------------------------------------------- | ------------------------------------------------------ |
| Inline import conversion | `<Image src="./image.jpg" />`                   | `<Image src={import("./image.jpg")} />`                |
| img conversion           | `<img />`                                       | `<Image />`                                            |
| picture conversion       | `<picture />`                                   | `<Picture />`                                          |
| Markdown conversion      | `![]("./image.png")`                            | `<Image src={import("./image.jpg")} />`                |
| Preserve attributes      | `<img width={500} height={500} alt="Alt Text">` | `<Image width={500} height={500} alt="Alt Text" />`    |
|                          | `![Alt Text]("./image.png")`                    | `<Image alt="Alt Text" src={import("./image.jpg")} />` |
| Component auto import    |                                                 | `import {Image} from "@astrojs/image/components";`     |

## Installation

NOTE: This plugin is mdx and esm only. Using components (such as the `@astrojs/image` component) from vanilla Markdown (`.md` files) has been deprecated in astro. This plugin, and astro's release candidate, require you to use mdx if you want to use components.

Install this remark preset:

```bash
# Using NPM
npm install @altano/remark-astrojs-image
# Using Yarn
yarn add @altano/remark-astrojs-image
```

Edit your astro.config.mjs to add this remark preset:

```js
...
import remarkAstrojsImage from "@altano/remark-astrojs-image";

export default defineConfig({
  integrations: [
    // You should already have the @astrojs/image integration
    image(),
    // and the @astrojs/mdx integration
    mdx({
      remarkPlugins: {
        // so just add this preset as a remark plugin:
        extends: [remarkAstrojsImage],
      },
    }),
  ],
});
```
