import React from "react";
import { useSet } from "@uidotdev/usehooks";
import { Observer } from "./Observer";

interface Context {
  mountedElements: Set<Element>;
}

export const ElementObserverContext = React.createContext<Context | null>(null);

export interface Options {
  /** The css selector used to select which elements are observed. */
  selector: string;
  /** The React tree to observe. */
  tree: React.ReactNode;
  /**
   * If `true`, a 'div' will wrap the observed children. If `false`, `children`
   * must be a single child element that can take a ref (which will be
   * overwritten).
   */
  useWrapperDiv?: boolean | undefined;
}

type Result = [
  /** The elements that are currently mounted */
  mountedElements: Set<Element>,
  /** The React tree that should be rendered by the caller */
  treeToRender: React.ReactElement,
];

/**
 * Allows observing mount/unmount of elements that match a given selector in the
 * given React tree. Tree must be static: only the mounting of the tree itself
 * is monitored. If the tree's DOM is dynamically changed those mounts and
 * unmounts will not be detected.
 *
 * @returns A tuple of: (1) set of elements and (2) the observed tree to be
 *   rendered.
 */
export function useElementObserver({
  tree,
  selector,
  useWrapperDiv = true,
}: Options): Result {
  // TODO: Re-compute on every render to catch mutations? Add mutation observer
  // to catch changes to grandchildren?
  const mountedElements = useSet<Element>();
  const observedTree = (
    <ElementObserverContext.Provider value={{ mountedElements }}>
      <Observer selector={selector} useWrapperDiv={useWrapperDiv}>
        {tree}
      </Observer>
    </ElementObserverContext.Provider>
  );
  return [mountedElements, observedTree];
}
