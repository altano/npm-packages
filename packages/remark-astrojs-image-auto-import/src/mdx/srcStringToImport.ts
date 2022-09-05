import { createMdxJsxImportExpression } from "./createMdxJsxImportExpression";
import * as fs from "node:fs/promises";
// import fs from "node:fs";
import { constants } from "node:fs";
import { resolve } from "node:path";
import { extract } from "../array";
import { unquoteIfNecessary } from "../string";
import logger from "../logger";
import { cyan } from "kleur/colors";

import type { RemarkAstroJSImageAutoImportConfig } from "../config";
import type {
  MdxJsxAttribute,
  MdxJsxExpressionAttribute,
  MdxJsxFlowElement,
} from "mdast-util-mdx-jsx";
import type { VFile } from "vfile";

function isMdxJsxAttribute(
  attr: MdxJsxAttribute | MdxJsxExpressionAttribute,
): attr is MdxJsxAttribute {
  return attr.type === "mdxJsxAttribute";
}

function isNonFileUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol !== "file";
  } catch {
    // All non-parseable URLs to be treated as potentially being file urls
    return false;
  }
}

interface MdxJsxStringSrcAttribute extends MdxJsxAttribute {
  name: "src";
  value: string;
}

function isMdxJsxStringSrcAttribute(
  attr: MdxJsxAttribute | MdxJsxExpressionAttribute,
): attr is MdxJsxStringSrcAttribute {
  return (
    isMdxJsxAttribute(attr) &&
    attr.name === "src" &&
    typeof attr.value === "string"
  );
}

export async function stringSrcToImportSrc(
  element: MdxJsxFlowElement,
  vfile: VFile,
  config: RemarkAstroJSImageAutoImportConfig,
): Promise<MdxJsxFlowElement> {
  const endCompletionLogger = logger.logVFileOperation(vfile);
  const { ignoreFileNotFound, ignoreNonFileUrl } = config;

  const endCompletionLogger2 = logger.logOperation(
    `${vfile.basename} stringSrcToImportSrc/extract`,
  );
  const [srcAttr, otherAttributes] = extract(
    element.attributes,
    isMdxJsxStringSrcAttribute,
  );
  endCompletionLogger2();
  if (srcAttr == null) {
    return element;
  }

  const src = unquoteIfNecessary(srcAttr.value);

  if (isNonFileUrl(src)) {
    if (ignoreNonFileUrl) {
      return element;
    } else {
      throw new Error(
        `"${element}" pointed at an http url and the "skipNonFileUrl" option is false`,
      );
    }
  }

  if (vfile.dirname == null) {
    throw new Error(`Expected vfile.dirname to be a string`);
  }

  const endCompletionLogger3 = logger.logOperation(
    `${vfile.basename} stringSrcToImportSrc/resolve`,
  );
  const absolutePath = resolve(vfile.dirname, src);
  endCompletionLogger3();

  if (!ignoreFileNotFound) {
    try {
      const endCompletionLogger4 = logger.logOperation(
        `${vfile.basename} stringSrcToImportSrc/fs.access`,
      );
      await fs.access(absolutePath, constants.F_OK);
      endCompletionLogger4();
    } catch {
      throw new Error(
        `${absolutePath} could not be found on disk and the "ignoreFileNotFound" option is false`,
      );
    }
  }

  const endCompletionLogger5 = logger.logOperation(
    `${vfile.basename} stringSrcToImportSrc/createMdxJsxImportExpression`,
  );
  const srcWithImportAttr = createMdxJsxImportExpression("src", absolutePath);
  endCompletionLogger5();
  endCompletionLogger();
  return {
    ...element,
    attributes: [...otherAttributes, srcWithImportAttr],
  };
}
