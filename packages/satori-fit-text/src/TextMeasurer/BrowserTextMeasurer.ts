/* v8 ignore start */
import log from "../log";
import { TextMeasurer, type Dimensions } from "./TextMeasurer";
import getWidthAdjustedForInlineBleed from "./getWidthAdjustedForInlineBleed";

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
      const { width, height } = svg.getBBox();
      const widthAdjusted = getWidthAdjustedForInlineBleed(svg, width);

      log({
        fontSize,
        width,
        widthAdjusted,
        height,
        widthFits: widthAdjusted <= this.maxWidth,
        heightFits: height <= this.maxHeight,
      });

      return { width: widthAdjusted, height };
    } finally {
      svg.parentElement?.removeChild?.(svg);
    }
  }
}
/* v8 ignore stop */
