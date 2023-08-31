import { html as htmlToVNode } from "satori-html";
import he from "he";

export type VNode = ReturnType<typeof htmlToVNode>;

function walkJsxTree(vnode: VNode, callback: (vnode: VNode) => void): void {
  callback(vnode);

  const { children } = vnode.props;
  if (children == null || typeof children === "string") {
    return;
  } else if (Array.isArray(children)) {
    children.forEach((child) => walkJsxTree(child, callback));
    // This isn't actually reachable. The TS types for satori-html are a lie.
    /* c8 ignore next 3 */
  } else {
    walkJsxTree(children, callback);
  }
}

function patchJsxTreeForSatori(vnode: VNode): void {
  walkJsxTree(vnode, (vnode) => {
    const { style } = vnode.props;
    if (
      style != null &&
      typeof style["lineHeight"] === "string" &&
      style["lineHeight"] != ""
    ) {
      // Fix lineHeight (see https://github.com/vercel/satori/issues/535)
      const num = Number(style["lineHeight"]);
      if (!isNaN(num)) {
        style["lineHeight"] = num;
      }
    }
  });
}

export default function getSatoriFriendlyVNode(html: string): VNode {
  // Decode html entities
  const htmlWithDecodedHtmlEntities = he.decode(html);

  // Get a vnode
  const vnode = htmlToVNode(htmlWithDecodedHtmlEntities);

  // Patch that vnode to be Satori friendly
  patchJsxTreeForSatori(vnode);

  return vnode;
}
