import satori from "satori";

import type React from "react";
import type { Dimensions, Font } from "../types.js";

// getBBox seems to be off by a very tiny fraction with certain versions of
// Inter. Maybe that makes sense... maybe there's a better way of measuring
// things. But for now, fudge it...
const epsilon = 0.0001;

export abstract class TextMeasurer {
  #fonts: Font[];
  constructor(
    protected text: string,
    protected font: Font,
    protected maxWidth: number,
    protected maxHeight: number,
    protected lineHeight: number | "normal",
  ) {
    // Satori keeps a WeakMap of fonts arrays. Adding a new font is very
    // expensive, so let's make sure we always return the (referentially) same
    // array if the font is the same, to improve performance.
    this.#fonts = [this.font];
  }

  abstract getDimensions(fontSize: number): Promise<Dimensions>;

  async doesSizeFit(fontSize: number): Promise<boolean> {
    const { width, height } = await this.getDimensions(fontSize);
    return (
      width - epsilon <= this.maxWidth && height - epsilon <= this.maxHeight
    );
  }

  protected async createSvgXmlString(fontSize: number): Promise<string> {
    const node: React.ReactElement = {
      type: "div",
      key: "satori-fit-text-measure-node",
      props: {
        style: {
          // Static styles
          background: "white",
          color: "black",
          display: "flex",
          flex: 1,
          boxSizing: "border-box",
          margin: 0,
          padding: 0,

          // Dynamic styles based on input
          fontSize,
          fontFamily: this.font.name,
          maxWidth: this.maxWidth,
          lineHeight: this.lineHeight,
        },
        children: this.text,
      },
    } as const;

    // vnode => svg
    return satori(node, {
      fonts: this.#fonts,
      width: this.maxWidth * 2,
      height: this.maxHeight * 2,
    });
  }
}
