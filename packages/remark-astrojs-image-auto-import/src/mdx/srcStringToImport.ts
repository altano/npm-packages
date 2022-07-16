import { createMdxJsxImportExpression } from "./createMdxJsxImportExpression";
import * as fs from "node:fs/promises";
import { constants } from "node:fs";
import { resolve, join, isAbsolute } from "node:path";
import { extract } from "../array";
import { unquoteIfNecessary } from "../string";

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
  const { ignoreFileNotFound, ignoreNonFileUrl } = config;

  const [srcAttr, otherAttributes] = extract(
    element.attributes,
    isMdxJsxStringSrcAttribute,
  );
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

  if (!ignoreFileNotFound) {
    if (vfile.dirname == null) {
      throw new Error(`Null vfile.dirname unexpected`);
    }
    const path = resolve(join(vfile.dirname, src));
    try {
      await fs.access(path, constants.F_OK);
      // console.log(`FOUND path: ${path} (${resolve(path)})`);
    } catch {
      throw new Error(
        `${path} could not be found on disk and the "ignoreFileNotFound" option is false`,
      );
    }
  }

  const relativePath = isAbsolute(src) ? `./${src}` : src;
  const srcWithImportAttr = createMdxJsxImportExpression("src", relativePath);
  // console.log({ result: srcWithImportAttr });
  return {
    ...element,
    attributes: [...otherAttributes, srcWithImportAttr],
  };
}
