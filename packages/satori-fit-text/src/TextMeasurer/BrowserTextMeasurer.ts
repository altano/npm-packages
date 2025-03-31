/* v8 ignore start */
import log from "../log.js";
import { TextMeasurer } from "./TextMeasurer.js";
import type { Dimensions } from "../types.js";

export default class BrowserTextMeasurer extends TextMeasurer {
  #getSvgElement(svgText: string): SVGSVGElement {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.innerHTML = svgText;
    const svg = div.firstElementChild;
    if (svg == null || !(svg instanceof SVGSVGElement)) {
      throw new Error(`Child should be svg element`);
    }
    return svg;
  }

  async getDimensions(fontSize: number): Promise<Dimensions> {
    const svgText = await this.generateSvg(fontSize);
    const svg = this.#getSvgElement(svgText);

    try {
      document.body.appendChild(svg);
      const dimensions = svg.getBBox();
      const { width, height } = dimensions;

      log({
        fontSize,
        width: `${width}px`,
        height: `${height}px`,
        widthFits: `${width}px ${width <= this.maxWidth ? "DOES" : "does NOT"} fit in ${this.maxWidth}`,
        heightFits: `${height}px ${height <= this.maxHeight ? "DOES" : "does NOT"} fit in ${this.maxHeight}`,
      });

      return dimensions;
    } finally {
      svg.parentElement?.removeChild?.(svg);
    }
  }
}
/* v8 ignore stop */
