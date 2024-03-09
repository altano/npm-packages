> ⚠️ **WORK IN PROGRESS**: This package requires changes[^filename-change] in Astro before it will be useable. Sit tight!

# astro-html-to-image

This is an [Astro middleware](https://docs.astro.build/guides/middleware/) that allows you to easily render Astro components to images. This provides the foundation for Astro integrations like [@altano/astro-opengraph-image](https://www.npmjs.com/package/@altano/astro-opengraph-image).

# Prerequisites

- This middleware is for [Astro](https://astro.build).

# Installation

In your existing Astro project:

```sh
# Using NPM
npm install @altano/astro-html-to-image
# Using Yarn
yarn add @altano/astro-html-to-image
# Using PNPM
pnpm add @altano/astro-html-to-image
```

# Setup

Create a `middleware.ts` file[^middleware-docs] if you haven't already. `middleware.ts`:

```ts
import { createHtmlToImageMiddleware } from "@altano/astro-html-to-image";

export const onRequest = createHtmlToImageMiddleware({ ... });
```

Create a component to convert to an image. It must have a `.png.astro` extension, e.g. `image.png.astro`:

```astro
<html><body>Hello!</body></html>
```

NOTE: Your Astro component must be HTML elements and styles [supported by Satori](https://github.com/vercel/satori#jsx), e.g. it can't be stateful or use `calc()` in css. The [OG Image Playground](https://og-playground.vercel.app/) is a great place to test your component before copying it into your Astro project.

# Example Usage

# TODO Update this readme

`middleware.ts`:

```ts
import { createHtmlToImageMiddleware } from "@altano/astro-html-to-image";

export const onRequest = createHtmlToImageMiddleware({
  runtime: "nodejs",
  format: "png",
  async getSvgOptions() {
    const interRegularBuffer = await fetch(`https://files.terriblefish.com/fonts/Inter/v4/extras/otf/Inter-Regular.otf`).then((res) => res.arrayBuffer());
    return {
      width: 800,
      height: 200,
      fonts: [
        {
          name: "Inter",
          data: interRegularBuffer,
          weight: 400,
          style: "normal",
        },
      ],
    };
  },
});
```

`image.png.astro`:

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
      Kurt's Website!
    </h1>
    <p style="font-weight: 400;
              font-size: 2rem;">
      This is rendered as a PNG image.
    </p>
  </body>
</html>
```

See https://github.com/altano/npm-packages/tree/main/examples/astro-html-to-image for a slightly more involved example.

# Options Reference

`createHtmlToImageMiddleware` requires the following options:

- `runtime`: currently only "nodejs".
- `format`: Any output format that the [@resvg/resvg-wasm](https://www.npmjs.com/package/@resvg/resvg-wasm) library accepts, which is currently only "png".
- `getSvgOptions`: Options that the [vercel/satori](https://github.com/vercel/satori) library accepts. At the very least, you must specify dimensions and one font to use.

See the TypeScript type-hints and comments for more info.

# Recipes

## Using Custom Fonts

`middleware.ts`:

```ts
import { createHtmlToImageMiddleware } from "@altano/astro-html-to-image";

export const onRequest = createHtmlToImageMiddleware({
  format: "png",
  async getSvgOptions() {
    const interRegularBuffer = await fetch(`https://files.terriblefish.com/fonts/Inter/v4/extras/otf/Inter-Regular.otf`).then((res) => res.arrayBuffer());
    const interBoldBuffer = await fetch(`https://files.terriblefish.com/fonts/Inter/v4/extras/otf/Inter-Regular.otf`).then((res) => res.arrayBuffer());
    return {
      width: 800,
      height: 200,
      fonts: [
        {
          name: "Inter",
          data: interRegularBuffer,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: interBoldBuffer,
          weight: 800,
          style: "normal",
        },
      ],
    };
  },
});
```

## Using Frameowork Components (e.g. React or Svelte)

See [the React component example](https://github.com/altano/npm-packages/blob/main/examples/astro-html-to-image/src/pages/react.png.astro).

# How it Works

This library is a tiny wrapper around:

- [`satori-html`](https://github.com/natemoo-re/satori-html) (html -> jsx)
- [`vercel/satori`](https://github.com/vercel/satori) (jsx -> svg)
- [@resvg/resvg-wasm](https://www.npmjs.com/package/@resvg/resvg-wasm) (svg -> png)

The pipeline looks like this:

```mermaid
flowchart LR
    S>component.astro] -->|astro| M[fa:fa-code html]
    M -->|middleware| A[[astro-html-to-image]]
    A -->|satori-html| B[fab:fa-react jsx]
    B -->|vercel/satori| C[fa:fa-image svg]
    C -->|resvg-wasm| D>"fa:fa-image png"]
```

[^filename-change]: https://github.com/withastro/roadmap/discussions/643
[^middleware-docs]: https://docs.astro.build/guides/middleware
