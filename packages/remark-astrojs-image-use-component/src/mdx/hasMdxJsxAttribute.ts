import type {
  MdxJsxAttribute,
  MdxJsxExpressionAttribute,
} from "mdast-util-mdx-jsx";

export function hasMdxJsxAttribute<
  T extends { attributes: (MdxJsxAttribute | MdxJsxExpressionAttribute)[] },
>(withAttr: T, attrName: string): boolean {
  return withAttr.attributes.some((attr) => {
    return attr.type === "mdxJsxAttribute" && attr.name === attrName;
  });
}
