import { visit, EXIT } from "unist-util-visit";

import type { Node, Data } from "unist";
import type { MdxjsEsm } from "mdast-util-mdxjs-esm";
import type {
  ImportDeclaration,
  ImportSpecifier,
  ImportDefaultSpecifier,
} from "estree";
import type { Root } from "mdast";

function createMdxjsEsmNode(
  url: string,
  value: string,
  specifier: ImportDefaultSpecifier | ImportSpecifier,
): MdxjsEsm {
  return {
    type: "mdxjsEsm",
    value,
    data: {
      estree: {
        type: "Program",
        sourceType: "module",
        body: [
          {
            type: "ImportDeclaration",
            source: {
              type: "Literal",
              value: url,
              raw: JSON.stringify(url),
            },
            specifiers: [specifier],
          },
        ],
      },
    },
  };
}

export function createMdxjsEsmDefaultNode(
  identifierName: string,
  url: string,
): MdxjsEsm {
  return createMdxjsEsmNode(url, `import ${identifierName} from "${url}"`, {
    type: "ImportDefaultSpecifier",
    local: { type: "Identifier", name: identifierName },
  } as ImportDefaultSpecifier);
}

export function createMdxjsEsmNamedNode(
  identifierName: string,
  url: string,
): MdxjsEsm {
  return createMdxjsEsmNode(url, `import {${identifierName}} from "${url}"`, {
    type: "ImportSpecifier",
    local: { type: "Identifier", name: identifierName },
    imported: { type: "Identifier", name: identifierName },
  } as ImportSpecifier);
}

function isMdxjsEsm(node: Node<Data>): node is MdxjsEsm {
  return node.type === "mdxjsEsm";
}

function isImportSpecifier(
  specifier: Node<Data>,
): specifier is ImportSpecifier {
  return specifier.type === "ImportSpecifier";
}

function isImportDeclaration(node: Node<Data>): node is ImportDeclaration {
  return node.type === "ImportDeclaration";
}

function parseMdxjsEsm(node: MdxjsEsm): null | [string, string] {
  const bodies = node.data?.estree?.body?.filter(isImportDeclaration) ?? [];
  const body = bodies[0];
  if (body == null) {
    return null;
  }

  const { value: srcValue } = body.source;
  if (typeof srcValue !== "string") {
    return null;
  }

  const specifier = body.specifiers.filter(isImportSpecifier)[0];
  if (specifier == null) {
    return null;
  }

  return [specifier.local.name, srcValue];
}

export function ensureMdxjsEsmExists(
  tree: Root,
  identifierName: string,
  url: string,
): void {
  let found = false;

  // console.log(`Checking if need to add import for ${identifierName}`);

  visit(tree, (node) => {
    if (isMdxjsEsm(node)) {
      const result = parseMdxjsEsm(node);
      if (result != null) {
        const [name, source] = result;
        if (identifierName === name && url === source) {
          found = true;
          // console.log({ importNode: node, result });
          return EXIT;
        }
      }
    }
    return;
  });

  if (!found) {
    const node = createMdxjsEsmNamedNode(identifierName, url);
    console.log({ addedImportNode: node });
    tree.children.unshift(node);
  }
}
