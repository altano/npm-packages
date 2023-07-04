import { generate } from "astring";
import { valueToEstree } from "estree-util-value-to-estree";
import { EXIT, visit as estreeVisit } from "estree-util-visit";
import GithubSlugger from "github-slugger";
import { remarkMdxToc } from "remark-mdx-toc";
import { visit } from "unist-util-visit";

import type { RemarkMdxTocOptions, TocEntry } from "remark-mdx-toc";
import type { Plugin } from "unified";
import type { MdxjsEsm } from "mdast-util-mdxjs-esm";
import type { Node } from "unist-util-visit/lib";
import type { ArrayExpression } from "estree";

type TableOfContentsEntry = TocEntry & {
  slug: string;
  children: TableOfContentsEntry[];
};

function sluggifyTocEntries(
  entries: TocEntry[],
  headingSlugger = new GithubSlugger(),
): TableOfContentsEntry[] {
  return entries.map((entry) => sluggifyTocEntry(entry, headingSlugger));
}

function sluggifyTocEntry(
  entry: TocEntry,
  headingSlugger: GithubSlugger,
): TableOfContentsEntry {
  return {
    ...entry,
    slug: headingSlugger.slug(entry.value),
    children: sluggifyTocEntries(entry.children, headingSlugger),
  };
}

export type RemarkMdxTocWithSlugsOptions = RemarkMdxTocOptions;

function assertMdxjsEsmNode(node: Node): asserts node is MdxjsEsm {
  if (node.type !== "mdxjsEsm") {
    throw new Error(`Node was unexpected type: ${node.type}`);
  }
}

/**
 * Remark plugin that, given a tree that has had remark-mdx-toc run over it
 * already, the toc data will be enhanced to have auto-generated slugs for every
 * heading. This uses github-slugger
 */
const remarkMdxTocWithSlugs: Plugin<[RemarkMdxTocWithSlugsOptions?]> = (
  options = {},
) => {
  const name = options.name ?? "toc"; // mirrors remark-mdx-toc

  return function mdxTocWithSlugsTransformer(ast): void {
    const mdast = ast;

    // visit all esm nodes in the mdx
    visit(mdast, ["mdxjsEsm"], (mdxNode) => {
      assertMdxjsEsmNode(mdxNode);
      // visit all nodes in the estree
      const estree = mdxNode.data?.estree;
      if (estree) {
        estreeVisit(estree, (esNode) => {
          if (
            esNode.type === "VariableDeclarator" &&
            esNode.id.type === "Identifier" &&
            esNode.id.name === name
          ) {
            // we found the "toc" variable declarator
            if (esNode.init) {
              // It's easier to be wasteful and do our transformations in JS,
              // instead of directly on the tree, and then convert it back to a
              // tree.
              const tocExportString = generate(esNode.init);
              const toc = JSON.parse(tocExportString);

              // Add slugs to the toc
              const tocWithSlugs = sluggifyTocEntries(toc);

              // Overwrite the existing toc export with ours
              const newTree = valueToEstree(tocWithSlugs);

              if (newTree.type === "ArrayExpression") {
                esNode.init = newTree as ArrayExpression; // different versions of @types/estree are screwing with TypeScript
              }
            }

            // We out
            return EXIT;
          }

          return;
        });
      }
    });
  };
};

// This plugin is a preset that combines remark-mdx-toc and our enhancements
// plugin. This makes it so that the user doesn't have to separately add the
// remark-mdx-toc plugin themselves.
const preset = {
  plugins: [remarkMdxToc, remarkMdxTocWithSlugs],
};

export default preset;
