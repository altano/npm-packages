// TODO Replace this with @types/svgdom when it's published
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/66501

interface SVGDocument extends Document {
  documentElement: HTMLElement & SVGSVGElement;
}

interface SVGWindow extends Window {
  document: SVGDocument;
}

declare module "svgdom" {
  function createSVGWindow(): SVGWindow;
  function createSVGDocument(): SVGDocument;

  function createWindow(): Window;
  function createDocument(): Document;

  function createHTMLWindow(): Window;
  function createHTMLDocument(): Document;
}
