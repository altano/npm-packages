import { is } from "unist-util-is";
import { visitAndReplace } from "@altano/remark-plugin-helpers";
import { stringSrcToImportSrc } from "./mdx/srcStringToImport";
import { getConfig } from "./config";
import logger from "./logger";

import type { VFile } from "vfile";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { Plugin } from "unified";
import type { Node } from "unist";
import type {
  RemarkAstroJSImageAutoImportConfig,
  RemarkAstroJSImageAutoImportOptions,
} from "./config";

interface AstroJSImageElement extends MdxJsxFlowElement {
  name: "Image" | "Picture";
}

function isAstroJSImageElement(node: Node): node is AstroJSImageElement {
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
  tree: Node,
  vfile: VFile,
): Promise<void> => {
  const endCompletionLogger = logger.logVFileOperation(vfile);

  await visitAndReplace(tree, undefined, async (node) => {
    if (!isAstroJSImageElement(node) || isIgnoredNode(node)) {
      return;
    }
    return stringSrcToImportSrc(node, vfile, config);
  });

  endCompletionLogger();
};

/**
 * A Remark plugin for converting the src attribute of @astrojs/image components
 * to inline imports
 */
const remarkAstroJSImageAutoImportPlugin: Plugin<
  [RemarkAstroJSImageAutoImportOptions?],
  Node
> = (options) => {
  const config = getConfig(options ?? {});
  return transformer.bind(null, config);
};

export default remarkAstroJSImageAutoImportPlugin;
