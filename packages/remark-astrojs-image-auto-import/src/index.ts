import { is } from "unist-util-is";
import { visitAndReplace } from "./mdx/visit";
import { stringSrcToImportSrc } from "./mdx/srcStringToImport";
import { getConfig } from "./config";

import type { VFile } from "vfile";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { Plugin } from "unified";
import type { Data, Node } from "unist";
import type { Root } from "mdast";
import type {
  RemarkAstroJSImageAutoImportConfig,
  RemarkAstroJSImageAutoImportOptions,
} from "./config";

interface AstroJSImageElement extends MdxJsxFlowElement {
  name: "Image" | "Picture";
}

function isAstroJSImageElement(node: Node<Data>): node is AstroJSImageElement {
  return (
    is(node, { type: "mdxJsxFlowElement", name: "Image" }) ||
    is(node, { type: "mdxJsxFlowElement", name: "Picture" })
  );
}

function isIgnoredNode(image: AstroJSImageElement): boolean {
  return image.attributes.some((attr) => {
    return (
      attr.type === "mdxJsxAttribute" && attr.name === "data-import-ignore"
    );
  });
}

const transformer = async (
  config: RemarkAstroJSImageAutoImportConfig,
  tree: Root,
  vfile: VFile,
): Promise<void> => {
  await visitAndReplace(tree, async (node) => {
    if (!isAstroJSImageElement(node) || isIgnoredNode(node)) {
      return;
    }
    return stringSrcToImportSrc(node, vfile, config);
  });
};

/**
 * A Remark plugin for converting the src attribute of @astrojs/image components
 * to inline imports
 */
const remarkAstroJSImageAutoImportPlugin: Plugin<
  [RemarkAstroJSImageAutoImportOptions?],
  Root
> = (options) => {
  const config = getConfig(options ?? {});
  return transformer.bind(null, config);
};

export default remarkAstroJSImageAutoImportPlugin;
