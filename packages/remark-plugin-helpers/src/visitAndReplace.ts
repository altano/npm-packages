import { visit, type Test } from "unist-util-visit";

import type { Node, Parent } from "unist";

export async function visitAndReplace(
  tree: Node,
  check: Test,
  getReplacement: (node: Node) => Promise<Node | undefined>,
): Promise<void> {
  const promises: Promise<void>[] = [];
  visit(tree, check, (node, index, parent: Parent) => {
    if (parent == null || index == null) {
      // We never transform the root node
      return;
    }
    const promise = getReplacement(node).then((replacementNode) => {
      if (replacementNode != null) {
        parent.children.splice(index, 1, replacementNode);
      }
      return undefined;
    });
    promises.push(promise);
  });

  // await all operations at the end instead of serially awaiting while visiting.
  await Promise.all(promises);
}
