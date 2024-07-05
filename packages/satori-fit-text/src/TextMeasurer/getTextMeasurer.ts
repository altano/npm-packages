import type { TextMeasurer } from "./TextMeasurer.js";

export async function getTextMeasurer(
  ...args: ConstructorParameters<typeof TextMeasurer>
): Promise<TextMeasurer> {
  // TODO Get browser testing working
  /* v8 ignore next 3 */
  if (typeof window !== "undefined") {
    const Measurer = await import("./BrowserTextMeasurer.js");
    return new Measurer.default(...args);
  } else {
    const Measurer = await import("./HeadlessTextMeasurer.js");
    return new Measurer.default(...args);
  }
}
