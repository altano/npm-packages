/**
 * textFit v2.3.1
 * Previously known as jQuery.textFit
 * 11/2014 by STRML (strml.github.com)
 * MIT License
 *
 * To use: textFit(document.getElementById('target-div'), options);
 *
 * Will make the *text* content inside a container scale to fit the container
 * The container is required to have a set width and height
 * Uses binary search to fit text with minimal layout calls.
 * Version 2.0 does not use jQuery.
 */

export interface Options {
  /**
   * if true, textFit will not set white-space: no-wrap
   */
  multiLine?: boolean;
  /**
   * disable to turn off automatic multi-line sensing
   */
  detectMultiLine?: boolean;
  minFontSize?: number;
  maxFontSize?: number;
  /**
   * if true, textFit will re-process already-fit nodes. Set to 'false' for
   * better performance
   */
  reProcess?: boolean;
  /**
   * if true, textFit will fit text to element width, regardless of text height
   */
  widthOnly?: boolean;
  /**
   * if true, textFit will use flexbox for vertical alignment
   */
  alignVertWithFlexbox?: boolean;
  /**
   * Sets the final size to the max multiple of this. Useful when a font
   * requires the font size to be a multiple of a number for optimal rendering.
   */
  sizeMultipleOf?: number;
}

const defaultSettings: Required<Options> = {
  multiLine: false,
  detectMultiLine: true,
  minFontSize: 6,
  maxFontSize: 80,
  reProcess: true,
  widthOnly: false,
  alignVertWithFlexbox: false,
  sizeMultipleOf: 1,
};

export function textFit(
  elements: HTMLElement | HTMLElement[],
  options: Options = {},
): void {
  // Extend options.
  const settings = Object.assign({}, defaultSettings, options);
  const els: HTMLElement[] = Array.isArray(elements) ? elements : [elements];

  // Process each el we've passed.
  els.forEach((el) => {
    processItem(el, settings);
  });
}

/**
 * The meat. Given an el, make the text inside it fit its parent.
 * @param  {DOMElement} el       Child el.
 * @param  {Object} settings     Options for fit.
 */
function processItem(el: HTMLElement, settings: Required<Options>): void {
  if (
    !isElement(el) ||
    (!settings.reProcess && el.getAttribute("textFitted"))
  ) {
    return;
  }

  // Set textFitted attribute so we know this was processed.
  if (!settings.reProcess) {
    el.setAttribute("textFitted", "1");
  }

  let innerSpan: HTMLElement;
  let low: number, mid: number, high: number;

  // Get element data.
  const originalHTML = el.innerHTML;
  const originalWidth = innerWidth(el);
  const originalHeight = innerHeight(el);

  // Don't process if we can't find box dimensions
  if (!originalWidth || (!settings.widthOnly && !originalHeight)) {
    if (!settings.widthOnly)
      throw new Error(
        "Set a static height and width on the target element " +
          el.outerHTML +
          " before using textFit!",
      );
    else
      throw new Error(
        "Set a static width on the target element " +
          el.outerHTML +
          " before using textFit!",
      );
  }

  // Add textFitted span inside this container.
  if (originalHTML.indexOf("textFitted") === -1) {
    innerSpan = document.createElement("span");
    innerSpan.className = "textFitted";
    // Inline block ensure it takes on the size of its contents, even if they are enclosed
    // in other tags like <p>
    innerSpan.style["display"] = "inline-block";
    innerSpan.innerHTML = originalHTML;
    el.innerHTML = "";
    el.appendChild(innerSpan);
  } else {
    // Reprocessing.
    const innerSpanNode = el.querySelector("span.textFitted");
    if (innerSpanNode == null) {
      throw new Error("Could not find `span.textFitted`");
    } else if (!(innerSpanNode instanceof HTMLElement)) {
      throw new Error("Element matching `span.textFitted` not a span");
    }
    innerSpan = innerSpanNode;
    // Remove vertical align if we're reprocessing.
    if (hasClass(innerSpan, "textFitAlignVert")) {
      innerSpan.className = innerSpan.className.replace("textFitAlignVert", "");
      innerSpan.style["height"] = "";
      el.className.replace("textFitAlignVertFlex", "");
    }
  }

  // Check if this string is multiple lines
  // Not guaranteed to always work if you use wonky line-heights
  let multiLine = settings.multiLine;
  if (
    settings.detectMultiLine &&
    !multiLine &&
    innerSpan.getBoundingClientRect().height >=
      parseInt(window.getComputedStyle(innerSpan).fontSize, 10) * 2
  ) {
    multiLine = true;
  }

  // If we're not treating this as a multiline string, don't let it wrap.
  if (!multiLine) {
    el.style.whiteSpace = "nowrap";
  }

  low = settings.minFontSize;
  high = settings.maxFontSize;

  // Binary search for highest best fit
  let size = low;
  while (low <= high) {
    mid = (high + low) >> 1;
    innerSpan.style.fontSize = mid + "px";
    const innerSpanBoundingClientRect = innerSpan.getBoundingClientRect();
    if (
      innerSpanBoundingClientRect.width <= originalWidth &&
      (settings.widthOnly ||
        innerSpanBoundingClientRect.height <= originalHeight)
    ) {
      size = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
    // await injection point
  }

  if (settings.sizeMultipleOf > 1) {
    // Snap the max size down to the nearest multiple of `settings.sizeMultipleOf`
    size = size - (size % settings.sizeMultipleOf);
  }

  // found, updating font if differs:
  if (innerSpan.style.fontSize != size + "px")
    innerSpan.style.fontSize = size + "px";
}

// Calculate height without padding.
function innerHeight(el: HTMLElement): number {
  const style = window.getComputedStyle(el, null);
  return (
    el.getBoundingClientRect().height -
    parseInt(style.getPropertyValue("padding-top"), 10) -
    parseInt(style.getPropertyValue("padding-bottom"), 10)
  );
}

// Calculate width without padding.
function innerWidth(el: HTMLElement): number {
  const style = window.getComputedStyle(el, null);
  return (
    el.getBoundingClientRect().width -
    parseInt(style.getPropertyValue("padding-left"), 10) -
    parseInt(style.getPropertyValue("padding-right"), 10)
  );
}

//Returns true if it is a DOM element
function isElement(o: unknown): o is HTMLElement {
  return typeof HTMLElement === "object"
    ? o instanceof HTMLElement //DOM2
    : o != null &&
        typeof o === "object" &&
        o !== null &&
        "nodeType" in o &&
        o.nodeType === 1 &&
        "nodeName" in o &&
        typeof o.nodeName === "string";
}

function hasClass(element: HTMLElement, cls: string): boolean {
  return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
}
