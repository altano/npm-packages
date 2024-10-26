import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import { MdxjsEsm } from "mdast-util-mdx";
import { name as isIdentifierName } from "estree-util-is-identifier-name";
import { valueToEstree } from "estree-util-value-to-estree";
import { Plugin } from "unified";

import type { Node, Parent } from "unist";
import type { MdxJsxFlowElement, MdxJsxAttribute } from "mdast-util-mdx-jsx";
import type { Heading } from "mdast";

export type TocEntry = {
  depth: number;
  // value of the heading
  value: string;
  attributes: { [key: string]: string };
  children: TocEntry[];
};

export type CustomTag = {
  /// regex to match the tag name
  name: RegExp;
  /// get depth from name
  depth: (name: string) => number;
};

export interface RemarkMdxTocOptions {
  /**
   * If specified, export toc using the name.
   * Otherwise, use `toc` as the name.
   */
  name?: string;
  /**
   * Add custom tag to toc
   */
  customTags?: CustomTag[];
}

function isMdxJsxFlowElement(node: Node): node is MdxJsxFlowElement {
  return node.type === "mdxJsxFlowElement";
}

function isHeading(node: Node): node is Heading {
  return node.type === "heading";
}

function isParent(node: Node): node is Parent {
  return "children" in node;
}

// Our plugin never returns null/undefined, so type it that way.
type RequiredReturn<T> = T extends (...args: (infer Param)[]) => infer Return
  ? (...args: Param[]) => Exclude<NonNullable<Return>, void>
  : never;

type PluginType = Plugin<[RemarkMdxTocOptions?]>;

const remarkMdxToc: RequiredReturn<PluginType> =
  (options = {}) =>
  (ast) => {
    const mdast = ast;

    // I don't know how to exercise this path in a test, BUT the typing for a
    // plugin does require this narrowing.
    /* v8 ignore next 3 */
    if (!isParent(mdast)) {
      throw new Error(`Root node must be a parent with children`);
    }

    const name = options.name ?? "toc";
    if (!isIdentifierName(name)) {
      throw new Error(`Invalid name for an identifier: ${name}`);
    }

    // structured toc
    const toc: TocEntry[] = [];
    // flat toc (share objects in toc, only for iterating)
    const flatToc: TocEntry[] = [];
    const createEntry = (
      node: Heading | MdxJsxFlowElement,
      depth: number,
    ): TocEntry => {
      let attributes = (node.data || {}) as TocEntry["attributes"];
      if (isMdxJsxFlowElement(node)) {
        attributes = Object.fromEntries(
          node.attributes
            .filter(
              (attribute) =>
                attribute.type === "mdxJsxAttribute" &&
                typeof attribute.value === "string",
            )
            .map((attribute) => [
              (attribute as MdxJsxAttribute).name,
              attribute.value,
            ]),
        ) as TocEntry["attributes"];
      }
      return {
        depth,
        value: toString(node, { includeImageAlt: false }),
        attributes,
        children: [],
      };
    };

    visit(mdast, ["heading", "mdxJsxFlowElement"], (node) => {
      let depth = 0;
      if (isMdxJsxFlowElement(node)) {
        const nodeName = node.name ?? "";
        let valid = false;
        if (/^h[1-6]$/.test(nodeName)) {
          valid = true;
          depth = parseInt(node.name!.substring(1));
        } else if (options.customTags) {
          for (const tag of options.customTags) {
            if (tag.name.test(nodeName)) {
              valid = true;
              depth = tag.depth(nodeName);
              break;
            }
          }
        }

        if (!valid) {
          return;
        }
      } else if (isHeading(node)) {
        depth = node.depth;
      } else {
        throw new Error(`Node was unexpected type: ${node.type}`);
      }

      const entry = createEntry(node, depth);
      flatToc.push(entry);

      // find the last node that is less deep (parent)
      // Fall back to root
      const parent: TocEntry | undefined = flatToc.findLast((current) => {
        return current.depth < entry.depth;
      });
      if (parent) {
        parent.children.push(entry);
      } else {
        toc.push(entry);
      }
    });

    // Export in MDX
    const tocExport: MdxjsEsm = {
      type: "mdxjsEsm",
      value: "",
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ExportNamedDeclaration",
              specifiers: [],
              source: null,
              declaration: {
                type: "VariableDeclaration",
                kind: "const",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: {
                      type: "Identifier",
                      name,
                    },
                    init: valueToEstree(toc),
                  },
                ],
              },
            },
          ],
        },
      },
    };

    mdast.children.unshift(tocExport);
  };

export default remarkMdxToc satisfies PluginType;
