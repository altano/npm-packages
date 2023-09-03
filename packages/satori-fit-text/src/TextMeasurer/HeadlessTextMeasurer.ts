import { SVG, registerWindow, type Svg } from "@svgdotjs/svg.js";
import { createSVGWindow } from "svgdom";
import { TextMeasurer } from "./TextMeasurer";

import type { Font } from "../types";

export default class HeadlessTextMeasurer extends TextMeasurer {
  #canvas: Svg;

  constructor(
    text: string,
    font: Font,
    maxWidth: number,
    maxHeight: number,
    lineHeight: number | "normal",
  ) {
    super(text, font, maxWidth, maxHeight, lineHeight);

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

  async #setFontSize(fontSize: number): Promise<void> {
    const svgText = await this.generateSvg(fontSize);
    this.#canvas.clear();
    this.#canvas.svg(svgText);
  }
}
