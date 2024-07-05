import { getTextMeasurer } from "./TextMeasurer/getTextMeasurer.js";

import type { Font } from "./types.js";

export type FindOptions = {
  /**
   * The text you want to fit
   */
  text: string;
  /**
   * The font of your text. Options are the same as [those taken by
   * Satori](https://github.com/vercel/satori#fonts), but only one font and not
   * an array of fonts is accepted here.
   */
  font: Font;
  /**
   * The max width the text must be contained in
   */
  maxWidth: number;
  /**
   * The max height the text must be contained in
   */
  maxHeight: number;
  /**
   * Optional: the CSS line height factor to use, e.g. 1.1
   */
  lineHeight?: number | "normal";
  /**
   * The minimum font size that should be returned, even if smaller fonts fit
   */
  minFontSize?: number;
  /**
   * The maximum font size that should be returned, even if larger fonts fit
   */
  maxFontSize?: number;
  /**
   * The maximum number of font sizes to try before giving up. Defaults to 1000.
   */
  maxTries?: number;
};

/**
 * Given text, dimensions, and some options, returns the largest font size that
 * would keep the text contained within the dimensions.
 */
export async function findLargestUsableFontSize({
  text,
  font,
  maxWidth,
  maxHeight,
  lineHeight = "normal",
  minFontSize = 1,
  maxFontSize = 1000,
  maxTries = 1000,
}: FindOptions): Promise<number> {
  if (maxTries < 2) {
    throw new Error("`maxTries` must be >= 2");
  }

  const textMeasurer = await getTextMeasurer(
    text,
    font,
    maxWidth,
    maxHeight,
    lineHeight,
  );

  for (
    let tries = 1, lower = minFontSize, upper = maxFontSize;
    tries < maxTries;
    ++tries
  ) {
    const searchCutoffThreshold = Math.min(1, lower);
    if (upper - lower <= searchCutoffThreshold) {
      return Math.floor(lower);
    }

    const sizeCandidate = Math.floor(lower + (upper - lower) / 2);
    const doesFit = await textMeasurer.doesSizeFit(sizeCandidate);

    if (doesFit) {
      lower = sizeCandidate;
    } else {
      upper = sizeCandidate;
    }
  }

  throw new Error(
    `Could not find a valid font size in ${
      maxTries - 1
    } attempts. Giving up. Please try again after constraining the search space, e.g. by restricting the min/max font size difference.`,
  );
}
