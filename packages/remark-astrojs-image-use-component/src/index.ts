import { getConfig } from "./config";
import { createAstroJSImageElement } from "./mdx/createAstroJSImageElement";
import {
  isMarkdownImage,
  isMdxJsxImageElement,
  isMdxJsxPictureElement,
} from "./types";
import { visitAndReplace } from "@altano/remark-plugin-helpers";
import { ensureMdxjsEsmExists } from "./mdx/mdxjsEsm";
import { hasMdxJsxAttribute } from "./mdx/hasMdxJsxAttribute";
import logger from "./logger";

import type { VFile } from "vfile";
import type { Plugin } from "unified";
import type { Node, Data } from "unist";
import type { Root } from "mdast";
import type {
  RemarkAstroJSImageUseComponentOptions,
  RemarkAstroJSImageUseComponentConfig,
} from "./config";
import type {
  MdxJsxAttribute,
  MdxJsxExpressionAttribute,
} from "mdast-util-mdx-jsx";

function isIgnoredNode<
  T extends { attributes: (MdxJsxAttribute | MdxJsxExpressionAttribute)[] },
>(image: T): boolean {
  return hasMdxJsxAttribute(image, "data-component-ignore");
}

const transformer = async (
  config: RemarkAstroJSImageUseComponentConfig,
  tree: Root,
  vfile: VFile,
): Promise<void> => {
  const endCompletionLogger = logger.logVFileOperation(vfile);
  let needToAddImageImport = false;
  let needToAddPictureImport = false;

  if (config.convertMarkdownImages) {
    await visitAndReplace(tree, "image", async (node: Node<Data>) => {
      if (!isMarkdownImage(node)) {
        return;
      }
      needToAddImageImport = true;
      return createAstroJSImageElement(node);
    });
  }

  if (config.convertJsxImages) {
    await visitAndReplace(tree, undefined, async (node: Node<Data>) => {
      if (!isMdxJsxImageElement(node) || isIgnoredNode(node)) {
        return;
      }
      needToAddImageImport = true;
      return createAstroJSImageElement(node);
    });
  }

  if (config.convertJsxPictures) {
    await visitAndReplace(tree, undefined, async (node: Node<Data>) => {
      if (!isMdxJsxPictureElement(node) || isIgnoredNode(node)) {
        return;
      }
      needToAddPictureImport = true;
      return createAstroJSImageElement(node);
    });
  }

  if (needToAddImageImport) {
    ensureMdxjsEsmExists(tree, "Image", "@astrojs/image/components");
  }

  if (needToAddPictureImport) {
    ensureMdxjsEsmExists(tree, "Picture", "@astrojs/image/components");
  }

  endCompletionLogger();
};

/**
 * A Remark plugin for converting images in mdx to @astrojs/image components
 */
const remarkAstroJSImageUseComponentPlugin: Plugin<
  [RemarkAstroJSImageUseComponentOptions?],
  Root
> = (options) => {
  const config = getConfig(options ?? {});
  return transformer.bind(null, config);
};

export default remarkAstroJSImageUseComponentPlugin;
