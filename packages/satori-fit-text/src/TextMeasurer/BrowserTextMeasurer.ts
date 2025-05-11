/// <reference lib="dom" />

// TODO Factor this out to a separate project so it doesn't infect the whole
// project with the dom lib

/* v8 ignore start */
import log from "../log.js";
import { TextMeasurer } from "./TextMeasurer.js";
import type { Dimensions } from "../types.js";

export default class BrowserTextMeasurer extends TextMeasurer {
  #createSvgElement(svgXML: string): SVGSVGElement {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = svgXML;
    const svg = wrapper.firstElementChild;
    if (svg == null || !(svg instanceof SVGSVGElement)) {
      throw new Error(`Child should be svg element`);
    }
    return svg;
  }

  async getDimensions(fontSize: number): Promise<Dimensions> {
    const svgXML = await this.createSvgXmlString(fontSize);
    const svg = this.#createSvgElement(svgXML);

    try {
      document.body.appendChild(svg);
      const dimensions = svg.getBBox();
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
    } finally {
      svg.parentElement?.removeChild?.(svg);
    }
  }
}
/* v8 ignore stop */
