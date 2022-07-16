import { visit } from "unist-util-visit";
import { isMdxJsxImageElement, isMdxJsxPictureElement } from "../types";

import type { Node, Data } from "unist";
import type { Parent, Content } from "mdast";
import type {
  MdxJsxAttribute,
  MdxJsxExpressionAttribute,
} from "mdast-util-mdx-jsx";

function isIgnoredNode<
  T extends { attributes: (MdxJsxAttribute | MdxJsxExpressionAttribute)[] },
>(image: T): boolean {
  return image.attributes.some((attr) => {
    return (
      attr.type === "mdxJsxAttribute" && attr.name === "data-component-ignore"
    );
  });
}

export function visitAndReplace(
  tree: Node<Data>,
  selector: string | undefined,
  getReplacement: (node: Node<Data>) => Content | undefined,
): void {
  visit(
    tree,
    selector,
    (node: Node<Data>, index: number | null, parent: Parent | null) => {
      if (parent == null || index == null) {
        // We never transform the root node
        return;
      }
      if (
        (isMdxJsxImageElement(node) || isMdxJsxPictureElement(node)) &&
        isIgnoredNode(node)
      ) {
        return;
      }
      const replacementNode = getReplacement(node);
      if (replacementNode == null) {
        return;
      }
      parent.children.splice(index, 1, replacementNode);
    },
  );
}
