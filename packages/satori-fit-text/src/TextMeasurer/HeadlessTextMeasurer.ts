import { SVG, registerWindow, type Svg } from "@svgdotjs/svg.js";
import { createSVGWindow } from "svgdom";
import log from "../log.js";
import type { Font } from "../types.js";
import { TextMeasurer } from "./TextMeasurer.js";
import { Dimensions } from "../types.js";

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
    const dimensions = this.#canvas.bbox();
    const width = dimensions.width + Math.min(dimensions.x, 0);
    const height = dimensions.height + Math.min(dimensions.y, 0);

    log({
      fontSize,
      width: `${width}px`,
      height: `${height}px`,
      widthFits: `${width}px ${width <= this.maxWidth ? "DOES" : "does NOT"} fit in ${this.maxWidth}`,
      heightFits: `${height}px ${height <= this.maxHeight ? "DOES" : "does NOT"} fit in ${this.maxHeight}`,
    });

    return { width, height };
  }

  async #setFontSize(fontSize: number): Promise<void> {
    const svgXML = await this.createSvgXmlString(fontSize);
    this.#canvas.clear();
    this.#canvas.svg(svgXML);
  }
}
