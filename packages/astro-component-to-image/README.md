> ⚠️ **WORK IN PROGRESS**: This package requires changes[^filename-change] in Astro before it will be useable. Sit tight!

# astro-component-to-image

This is an [Astro middleware](https://docs.astro.build/guides/middleware/) that allows you to easily render Astro components to images instead of html.

# Installation

In your existing Astro project:

- `npm install sharp @altano/astro-component-to-image`
- `yarn add sharp @altano/astro-component-to-image`
- `pnpm add sharp @altano/astro-component-to-image`

NOTE: Sharp does not yet support ESM. I've left it as a peer dependency. This allows you to install your own version, which Astro will automatically handle correctly.

# Setup

1. Create a `middleware.ts` file[^middleware-docs] if you haven't already.
2. Create a component to convert to an image. It must have a ".format.astro" extension, e.g. if you are creating png images your component must end in ".png.astro".

NOTE: Your Astro component must be HTML elements and styles [supported by Satori](https://github.com/vercel/satori#jsx), e.g. it can't be stateful or use `calc()` in css.

# Example Usage

`middleware.ts`:

```ts
import { createHtmlToImageMiddleware } from "@altano/astro-component-to-image";

export const onRequest = createHtmlToImageMiddleware({
  format: "png",
  async getSatoriOptions() {
    const interRegularBuffer = await fetch(`https://rsms.me/inter/font-files/Inter-Regular.woff`).then((res) => res.arrayBuffer());
    return {
      width: 800,
      height: 200,
      fonts: [
        {
          name: "Inter Variable",
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

See https://github.com/altano/npm-packages/tree/main/examples/astro-component-to-image for a slightly more involved example.

# Options Reference

`createHtmlToImageMiddleware` requires the following options:

- `format`: Any output format that the sharp library accepts, as a string, e.g. "avif", "jpg", "png", "webp", "gif", etc.
- `getSatoriOptions`: Options that the vercel/satori library accepts. At the very least, you must specify dimensions and one font to use.

See the TypeScript type-hints and comments for more info.

# How it Works

This library is a tiny wrapper around:

- [`satori-html`](https://github.com/natemoo-re/satori-html) (html -> jsx)
- [`vercel/satori`](https://github.com/vercel/satori) (jsx -> svg)
- [`sharp`](https://github.com/lovell/sharp) (svg -> png/jpg/etc)

The pipeline looks like this:

```mermaid
flowchart LR
    S>component.astro] -->|astro| M[fa:fa-code html]
    M -->|middleware| A[[astro-component-to-image]]
    A -->|satori-html| B[fab:fa-react jsx]
    B -->|vercel/satori| C[fa:fa-image svg]
    C -->|sharp| D>"fa:fa-image image (png/jpg/etc)"]
```

[^filename-change]: https://github.com/withastro/roadmap/discussions/643
[^middleware-docs]: https://docs.astro.build/guides/middleware
