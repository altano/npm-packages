/// <reference types="react" />
import React from "react";
interface Options {
    tree: React.ReactNode;
    useWrapperDiv?: boolean;
    onMount: (e: Element) => void;
    onUnmount: (e: Element) => void;
    selector: string;
}
/**
 * Allows observing mount/unmount of elements that match a given selector in the
 * given React tree. Tree must be static: only the mounting of the tree itself
 * is monitored. If the tree's DOM is dynamically changed those mounts and
 * unmounts will not be detected.
 *
 * @param tree The React tree to observe.
 * @param onMount The callback that will be passed any elements in the tree that
 * match the given selector, as they mount.
 * @param onUnmount The callback that will be passed any elements in the tree
 * that match the given selector, as they unmount.
 * @param selector The css selector used to select which elements are observed.
 * @param useWrapperDiv If `true`, a 'div' will wrap the observed children. If
 * `false`, `children` must be a single child element that can take a ref (which
 * will be overwritten).
 * @returns A tuple of: (1) array of elements and (2) the observed tree to be
 * rendered.
 */
declare function useElementObserver({ tree, onMount, onUnmount, selector, useWrapperDiv, }: Options): [React.ReactElement];
export { useElementObserver };
