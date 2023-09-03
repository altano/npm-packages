import { TextMeasurer } from "./TextMeasurer";

export default class BrowserTextMeasurer extends TextMeasurer {
  #getSvgElement(svgText: string): SVGSVGElement {
    const div = document.createElement("div");
    div.innerHTML = svgText;
    const svg = div.firstElementChild;
    if (svg == null || !(svg instanceof SVGSVGElement)) {
      throw new Error(`Child should be svg element`);
    }
    return svg;
  }

  async doesSizeFit(fontSize: number): Promise<boolean> {
    const svgText = await this.generateSvg(fontSize);
    const svg = this.#getSvgElement(svgText);

    try {
      document.body.appendChild(svg);
      const { width, height } = svg.getBBox();
      return width <= this.maxWidth && height <= this.maxHeight;
    } finally {
      svg.parentElement?.removeChild?.(svg);
    }
  }
}
