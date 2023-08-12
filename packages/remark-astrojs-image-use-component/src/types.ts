import { is } from "unist-util-is";

import type { Node } from "unist";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { Image as MarkdownImage } from "mdast";

export interface MdxJsxImageElement extends MdxJsxFlowElement {
  type: "mdxJsxFlowElement";
  name: "img";
}

export interface MdxJsxPictureElement extends MdxJsxFlowElement {
  type: "mdxJsxFlowElement";
  name: "picture";
}

export function isMdxJsxImageElement(node: Node): node is MdxJsxImageElement {
  return is(node, { type: "mdxJsxFlowElement", name: "img" });
}

export function isMdxJsxPictureElement(
  node: Node,
): node is MdxJsxPictureElement {
  return is(node, { type: "mdxJsxFlowElement", name: "picture" });
}

export function isMarkdownImage(node: Node): node is MarkdownImage {
  return is(node, { type: "image" });
}
