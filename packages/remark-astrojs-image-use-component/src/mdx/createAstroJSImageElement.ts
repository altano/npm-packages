import type { Image } from "mdast";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { MdxJsxImageElement, MdxJsxPictureElement } from "../types";

export function createAstroJSImageElement(
  node: Image | MdxJsxImageElement | MdxJsxPictureElement,
): MdxJsxFlowElement {
  // return node;

  if (node.type === "image") {
    const { url, alt, title } = node;
    const element: MdxJsxFlowElement = {
      type: "mdxJsxFlowElement",
      name: "Image",
      attributes: [],
      children: [],
      data: { _mdxExplicitJsx: true },
    };
    if (url != null) {
      element.attributes.push({
        type: "mdxJsxAttribute",
        name: "src",
        value: url,
      });
    }
    if (alt != null) {
      element.attributes.push({
        type: "mdxJsxAttribute",
        name: "alt",
        value: alt,
      });
    }
    if (title != null) {
      element.attributes.push({
        type: "mdxJsxAttribute",
        name: "title",
        value: title,
      });
    }
    return element;
  } else {
    switch (node.name) {
      case "img":
        return {
          ...node,
          type: "mdxJsxFlowElement",
          name: "Image",
        };
      case "picture":
        return {
          ...node,
          type: "mdxJsxFlowElement",
          name: "Picture",
        };
    }
  }
}
