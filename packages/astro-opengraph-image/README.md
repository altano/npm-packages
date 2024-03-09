> ⚠️ **WORK IN PROGRESS**: This package requires changes[^filename-change] in Astro before it will be useable. Sit tight!

# astro-opengraph-image

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that lets you turn any Astro component (or framework component) into an Open Graph image for your Astro site.

Unlike existing Astro integrations for Open Graph images, this one:

- Doesn't require any out-of-band screenshotting. It's all Astro native, so to speak.
- Can turn ANY component into an Open Graph image. You're in full control of the html/css.

# Prerequisites

- This integration is for [Astro](https://astro.build).

# Installation

In your existing Astro project:

```sh
# Using NPM
npx astro add @altano/astro-opengraph-image
# Using Yarn
yarn astro add @altano/astro-opengraph-image
# Using PNPM
pnpm astro add @altano/astro-opengraph-image
```

# Configuration

You'll need to configure the integration in your Astro config. At the very least, you must provide some fonts to use (as there are no defaults).

```ts
export default defineConfig({
  integrations: [
    opengraphImage({
      async getSvgOptions() {
        return {
          fonts: [...],
        };
      },
    }),
  ],
});
```

Create a component to convert to an image. It must have a `.png.astro` extension, e.g. `image.png.astro`:

```astro
<html><body>Hello!</body></html>
```

NOTE: Your Astro component must be HTML elements and styles [supported by Satori](https://github.com/vercel/satori#jsx), e.g. it can't be stateful or use `calc()` in css. The [OG Image Playground](https://og-playground.vercel.app/) is a great place to test your component before copying it into your Astro project.

Lastly, in any pages/layouts that have a `opengraph-image.png.astro` in that route, you need to add the `<OpenGraphMeta />` component to generate opengraph meta tags in your head, e.g.:

```astro
---
import OpenGraphMeta from "@altano/astro-opengraph-image/components/meta.astro";
---

<html>
  <head>
    <OpenGraphMeta />
  </head>
  <body>
    <p>My opengraph-image should be the root one!</p>
  </body>
</html>
```

# Options Reference

The integration requires the following options:

- `getSvgOptions.fonts`: an array of fonts that will be used in your image component. Each font requires:
  - `name`: This is whatever you reference in your css, e.g. `Inter`
  - `path`: A string path to your font file. Can be in your node_modules folder, e.g. `"node_modules/@fontsource/inter/files/inter-latin-400-normal.woff"`
  - `weight`: A weight, from 100 to 900. You can provide different fonts for different weights.

See the TypeScript type-hints and comments for more info.

# Examples

## Using custom fonts

`astro.config.mts`:

```ts
import { defineConfig } from "astro/config";
import opengraphImage from "@altano/astro-opengraph-image";

// https://astro.build/config
export default defineConfig({
  integrations: [
    opengraphImage({
      async getSvgOptions() {
        return {
          fonts: [
            {
              name: "Inter",
              path: "node_modules/@fontsource/inter/files/inter-latin-400-normal.woff",
              weight: 400,
              style: "normal",
            },
            {
              name: "Inter",
              path: "node_modules/@fontsource/inter/files/inter-latin-800-normal.woff",
              weight: 800,
              style: "normal",
            },
          ],
        };
      },
    }),
  ],
});
```

`src/pages/opengraph-image.png.astro`:

```astro
---
/**
 * This is not used during image generation. It is only here
 * to make the fonts consistent between the generated image
 * and how the component is rendered if the image generation
 * middleware is disabled.
 */
import "@fontsource-variable/inter";
---

<html>
  <body
    style=`font-family: "Inter Variable";
           background: white;
           height: 100vh;
           width: 100vw;
           display: flex;
           flex-direction: column;
           align-items: center;
           justify-content: center;`
  >
    <h1
      style="font-weight: 800;
             font-size: 5rem;
             margin: 0;"
    >
      My Website!
    </h1>
    <p style="font-weight: 400;
              font-size: 2rem;">
      This is rendered as a PNG image.
    </p>
  </body>
</html>
```

`src/pages/index.astro`

```astro
<html>
  <head>
    <title>Homepage</title>
    <OpenGraphMeta title="My Website" description="This is a website." />
  </head>
  <body>
    ...
  </body>
</html>
```

See https://github.com/altano/npm-packages/tree/main/examples/astro-opengraph-image for a slightly more involved example.

## Serving another opengraph-image

If your `opengraph-image.png.astro` is somewhere else, you can specify a directory relative to the current request URL, e.g. to point at an `opengraph-image.png.astro` file you've put at the root of your site:

```astro
<html>
  <head>
    <title>My opengraph image is at the site root</title>
    <OpenGraphMeta directory="/" />
  </head>
</html>
```

## Adding title/description

Lastly, for convenience, you can optionally pass in `title` and/or `description` to get the `og:title` and `og:description` meta tags:

```astro
<OpenGraphMeta title="Nope" description="I'm not important" />
```

## Dynamic Routes

If you have a dynamic route such as `./src/pages/[...slug].astro`, convert it to `./src/pages/[...slug]/index.astro`

Along-side your dynamic route (e.g. `./src/pages/[...slug]/index.astro`) add `./src/pages/[...slug]/opengraph-image.png.astro`:

```
src/
├─ pages/
│  ├─ [...slug]/
│  │  ├─ index.astro
│  │  ├─ opengraph-image.png.astro
```

Within `opengraph-image.png.astro` you can either duplicate your implementation of `getStaticPaths` or you can re-export the same one used in `index.astro`:

```astro
---
import { getStaticPaths as gsp } from "./index.astro";
export const getStaticPaths = gsp;
---
```

# How it Works

This library is a tiny wrapper around [@altano/astro-html-to-image](https://github.com/altano/npm-packages/tree/main/packages/astro-html-to-image) which can convert any html response in Astro into an image.

[^filename-change]: https://github.com/withastro/roadmap/discussions/643
[^middleware-docs]: https://docs.astro.build/guides/middleware
