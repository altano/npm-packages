import type { MdxJsxAttribute } from "mdast-util-mdx-jsx";

export function createMdxJsxImportExpression(
  name: string,
  path: string,
): MdxJsxAttribute {
  return {
    type: "mdxJsxAttribute",
    name: name,
    value: {
      type: "mdxJsxAttributeValueExpression",
      value: `import("${path}")`,
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "ImportExpression",
                source: {
                  type: "Literal",
                  value: path,
                  raw: JSON.stringify(path),
                },
              },
            },
          ],
        },
      },
    },
  };
}
