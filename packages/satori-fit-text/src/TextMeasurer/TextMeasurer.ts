import satori from "satori";

import type React from "react";
import type { Dimensions, Font } from "../types.js";

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
    return width <= this.maxWidth && height <= this.maxHeight;
  }

  protected async generateSvg(fontSize: number): Promise<string> {
    const node = {
      type: "div",
      props: {
        style: {
          all: "initial",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          margin: 0,
          padding: 0,
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                // Static styles
                margin: 0,
                padding: 0,
                boxSizing: "border-box",

                // Dynamic styles based on input
                fontSize,
                fontFamily: this.font.name,
                maxWidth: this.maxWidth,
                lineHeight: this.lineHeight,
              },
              children: this.text,
            },
          },
        ],
      },
    } as const;

    // vnode => svg
    return satori(node as React.ReactNode, {
      fonts: this.#fonts,
      width: this.maxWidth * 2,
      height: this.maxHeight * 2,
    });
  }
}
