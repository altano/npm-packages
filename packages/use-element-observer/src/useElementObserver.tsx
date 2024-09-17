import React from "react";
import { useSet } from "@uidotdev/usehooks";
import { Observer } from "./Observer";
import type { ReactElementWithRef } from "./types";
export { ReactElementWithRef };

interface Context {
  mountedElements: Set<Element>;
}

export const ElementObserverContext: React.Context<Context | null> =
  React.createContext<Context | null>(null);

export type Options = ChildOptions & {
  selector: string;
};

export type ChildOptions =
  | {
      useWrapperDiv: false;
      tree: ReactElementWithRef;
    }
  | {
      useWrapperDiv: true;
      tree: React.ReactNode;
    }
  | {
      useWrapperDiv?: undefined;
      tree: React.ReactNode;
    };

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
 * @returns A tuple of: (1) set of elements and (2) the observed tree to be
 * rendered.
 */
export function useElementObserver({
  tree,
  selector,
  useWrapperDiv,
}: Options): [Set<Element>, React.ReactElement] {
  // TODO: Re-compute on every render to catch mutations? Add mutation observer
  // to catch changes to grandchildren?
  const mountedElements = useSet<Element>();
  const observedTree = (
    <ElementObserverContext.Provider value={{ mountedElements }}>
      {useWrapperDiv == null || useWrapperDiv === true ? (
        <Observer selector={selector} useWrapperDiv={true}>
          {tree}
        </Observer>
      ) : (
        <Observer selector={selector} useWrapperDiv={false}>
          {tree}
        </Observer>
      )}
    </ElementObserverContext.Provider>
  );
  return [mountedElements, observedTree];
}
