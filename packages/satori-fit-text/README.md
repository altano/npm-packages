# satori-fit-text

Calculate the largest text font size that will fit a bounding box, without a web browser. Works anywhere [Satori](https://github.com/vercel/satori) does, e.g. Node.js, web browser, Vercel edge runtime, etc.

![Demo](./assets/demo.gif)

## Installation

```sh
# Using NPM
npm install @altano/satori-fit-text
# Using Yarn
yarn add @altano/satori-fit-text
# Using PNPM
pnpm add @altano/satori-fit-text
```

## Example Usage

```ts
import { findLargestUsableFontSize, type Font } from "@altano/satori-fit-text";

async function getInter(): Promise<Font> {
  const interSemiBoldBuffer = await fetch(`https://rsms.me/inter/font-files/Inter-SemiBold.woff`).then((res) => res.arrayBuffer());

  const font = {
    name: "Inter",
    data: interSemiBoldBuffer,
    weight: 600,
  };
}

const largestUsableFontSize = await findLargestUsableFontSize({
  lineHeight: 1,
  font: await getFont(),
  text: "Some text I want to be as big as possible",
  maxWidth: 1136,
  maxHeight: 429,
});

console.log(largestUsableFontSize);
```

## Potential Uses

Because this measures the maximum font size using Satori, the ideal use of this library is to determine the largest possible font size in something like an [Open Graph card](https://ogp.me/). If you dynamically generate Open Graph cards with text (e.g. the title of your blog post) you may want the text to fill the card's area as best as possible without overflowing. This library can help you achieve that.

## Implementation

The library tries various font sizes until it finds the ideal one that works. Each iteration is tested by generating an SVG with Satori and calculating the bounding box of the SVG.

## Performance

The font size search is a binary search between 1 and 1000 with `O(log maxFontSize-minFontSize)` runtime, or a default of `O(log 1000)`. You can improve performance by restricting the search space by reducing the difference between `minFontSize` and `maxFontSize`, which reduces the number of guesses.

If you're doing something like producing Open Graph cards then you probably don't need to worry about performance.
