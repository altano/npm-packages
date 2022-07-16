import { is } from "unist-util-is";

import type { Node, Data } from "unist";
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

export function isMdxJsxImageElement(
  node: Node<Data>,
): node is MdxJsxImageElement {
  return is(node, { type: "mdxJsxFlowElement", name: "img" });
}

export function isMdxJsxPictureElement(
  node: Node<Data>,
): node is MdxJsxPictureElement {
  return is(node, { type: "mdxJsxFlowElement", name: "picture" });
}

export function isMarkdownImage(node: Node<Data>): node is MarkdownImage {
  return is(node, { type: "image" });
}
