import { SVG, registerWindow, type Svg } from "@svgdotjs/svg.js";
import satori from "satori";
import getSatoriFriendlyVNode from "./getSatoriFriendlyVNode";
import { createSVGWindow } from "svgdom";

import type React from "react";
import type { Font } from "./types";

export class TextMeasurer {
  #canvas: Svg;

  constructor(
    private text: string,
    private font: Font,
    private maxWidth: number,
    private maxHeight: number,
    private lineHeight: number | "normal",
  ) {
    // register window and document
    const window = createSVGWindow();
    const document = window.document;
    registerWindow(window, document);

    // create canvas
    this.#canvas = SVG<SVGSVGElement>(document.documentElement);
  }

  async doesSizeFit(fontSize: number): Promise<boolean> {
    await this.#setFontSize(fontSize);
    const { width, height } = this.#canvas.bbox();
    return width <= this.maxWidth && height <= this.maxHeight;
  }

  async #generateSvg(fontSize: number): Promise<string> {
    // We render a border so that we measure the true dimensions of the text.
    // Without one, the bounding box might not include significant whitespace.
    // For example, if the last line of text has no descenders, the bounding box
    // would only extend to the baseline of the last line. With a border, the
    // bounding box will include all the whitespace between the baseline and the
    // descent of the text.
    const html = `
      <div style="
        margin: 0;
        padding: 0;
        font-size: ${fontSize}px;
        max-width: ${this.maxWidth}px;
        line-height: ${this.lineHeight};
        border: solid red 1px;
      ">
        ${this.text}
      </div>
    `.trim();

    // html text => vnode
    const vnode = getSatoriFriendlyVNode(html);

    // vnode => svg
    return satori(vnode as React.ReactNode, {
      fonts: [
        {
          name: this.font.name,
          data: this.font.data,
        },
      ],
      width: this.maxWidth * 2,
      height: this.maxHeight * 2,
    });
  }

  async #setFontSize(fontSize: number): Promise<void> {
    const svgText = await this.#generateSvg(fontSize);
    this.#canvas.clear();
    this.#canvas.svg(svgText);
  }
}
