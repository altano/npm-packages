import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";

export function createMdxJsxFlowElement(
  name: string,
  alt: string | null,
): MdxJsxFlowElement {
  return {
    type: "mdxJsxFlowElement",
    name: "img",
    children: [],
    attributes: [
      { type: "mdxJsxAttribute", name: "alt", value: alt },
      {
        type: "mdxJsxAttribute",
        name: "src",
        value: {
          type: "mdxJsxAttributeValueExpression",
          value: name,
          data: {
            estree: {
              type: "Program",
              sourceType: "module",
              comments: [],
              body: [
                {
                  type: "ExpressionStatement",
                  expression: { type: "Identifier", name },
                },
              ],
            },
          },
        },
      },
    ],
  };
}
