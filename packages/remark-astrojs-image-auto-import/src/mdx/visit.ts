import { visit as unistVisit } from "unist-util-visit";

import type { Node, Data } from "unist";
import type { Parent, Content } from "mdast";

export async function visitAndReplace(
  tree: Node<Data>,
  getReplacement: (node: Node<Data>) => Promise<Content | undefined>,
): Promise<void> {
  const promises: Promise<void>[] = [];
  unistVisit(
    tree,
    (node: Node<Data>, index: number | null, parent: Parent | null) => {
      if (parent == null || index == null) {
        // ignore root tree node
        return;
      }
      const promise = getReplacement(node).then((replacementNode) => {
        if (replacementNode != null) {
          parent.children.splice(index, 1, replacementNode);
        }
        return undefined;
      });
      promises.push(promise);
    },
  );
  // await all operations at the end instead of serially awaiting while visiting.
  await Promise.all(promises);
}
