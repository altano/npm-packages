import { getConfig } from "./config";
import { createAstroJSImageElement } from "./mdx/createAstroJSImageElement";
import {
  isMarkdownImage,
  isMdxJsxImageElement,
  isMdxJsxPictureElement,
} from "./types";
import { visitAndReplace } from "./mdx/visitAndReplace";
import { ensureMdxjsEsmExists } from "./mdx/mdxjsEsm";

import type { Plugin } from "unified";
import type { Node, Data } from "unist";
import type { Root } from "mdast";
import type { RemarkAstroJSImageUseComponentOptions } from "./config";

/**
 * A Remark plugin for converting images in mdx to @astrojs/image components
 */
const remarkAstroJSImageUseComponentPlugin: Plugin<
  [RemarkAstroJSImageUseComponentOptions?],
  Root
> = (options) => (tree: Root) => {
  // console.log(`remarkAstroJSImageUseComponentPlugin running on tree: `, tree);

  const config = getConfig(options ?? {});
  let needToAddImageImport = false;
  let needToAddPictureImport = false;

  if (config.convertMarkdownImages) {
    visitAndReplace(tree, "image", (node: Node<Data>) => {
      if (!isMarkdownImage(node)) {
        return;
      }
      needToAddImageImport = true;
      return createAstroJSImageElement(node);
    });
  }

  if (config.convertJsxImages) {
    visitAndReplace(tree, undefined, (node: Node<Data>) => {
      if (!isMdxJsxImageElement(node)) {
        return;
      }
      needToAddImageImport = true;
      return createAstroJSImageElement(node);
    });
  }

  if (config.convertJsxPictures) {
    visitAndReplace(tree, undefined, (node: Node<Data>) => {
      if (!isMdxJsxPictureElement(node)) {
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
};

export default remarkAstroJSImageUseComponentPlugin;
