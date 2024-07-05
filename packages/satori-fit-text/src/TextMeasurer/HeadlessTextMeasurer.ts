import { SVG, registerWindow, type Svg } from "@svgdotjs/svg.js";
import { createSVGWindow } from "svgdom";
import log from "../log.js";
import type { Font } from "../types.js";
import { TextMeasurer, type Dimensions } from "./TextMeasurer.js";
import getWidthAdjustedForInlineBleed from "./getWidthAdjustedForInlineBleed.js";

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

  async getDimensions(fontSize: number): Promise<Dimensions> {
    await this.#setFontSize(fontSize);
    const { width, height } = this.#canvas.bbox();
    const widthAdjusted = getWidthAdjustedForInlineBleed(
      this.#canvas.node,
      width,
    );

    log({
      fontSize,
      width,
      widthAdjusted,
      height,
      widthFits: widthAdjusted <= this.maxWidth,
      heightFits: height <= this.maxHeight,
    });

    return { width: widthAdjusted, height };
  }

  async #setFontSize(fontSize: number): Promise<void> {
    const svgText = await this.generateSvg(fontSize);
    this.#canvas.clear();
    this.#canvas.svg(svgText);
  }
}
