/**
 * Satori will sometimes render text slightly outside the div on the left (e.g.
 * x:-2). Having text slightly outside the box and drawing a border means we
 * will have a bounding box on the svg that is slightly larger than the actual
 * text size (by the amount of bleed).
 *
 * For example, if text starts at -2 and the div's bounding box is x:0 to
 * x:1200, the svg's bounding box will have width=1202px. And that won't
 * represent the actual width of the text.
 *
 * Let's account for this by just reducing the bounding box width by the amount
 * the text is bleeding outside the left or right and trust that Satori isn't
 * both letting the text bleed AND filling too much space.
 */
type getBBoxFn = SVGGraphicsElement["getBBox"];
export default function getWidthAdjustedForInlineBleed(
  svg: SVGSVGElement,
  svgWidth: number,
): number {
  let smallestXValue = 0;
  let largestYValue = svgWidth;

  for (const child of svg.children) {
    if ("getBBox" in child && typeof child["getBBox"] === "function") {
      const { x, y } = (child.getBBox as getBBoxFn)();
      smallestXValue = Math.min(smallestXValue, x);
      largestYValue = Math.max(largestYValue, y);
    }
  }

  // Sometimes the bleed is so small we hit floating point precision rounding
  // issues. Since we're not going for sub-pixel precision and just want to err
  // on the side of the text fitting, we should round the value.
  const xAdjustment = Math.ceil(Math.abs(smallestXValue));

  const yAdjustment =
    largestYValue <= svgWidth ? 0 : Math.ceil(largestYValue) - svgWidth;

  return svgWidth - xAdjustment - yAdjustment;
}
