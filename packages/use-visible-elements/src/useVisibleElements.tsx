import React from "react";

import { useElementObserver } from "@altano/use-element-observer";
import useSet from "react-use/lib/useSet";

type Context = Set<Element>;
const VisibleElementsContext = React.createContext<Context | null>(null);

export function useVisibilityOfTarget(href: string): boolean {
  const visibleElements = useVisibleElements();
  return [...visibleElements].some((s) => s.querySelector(href));
}

interface VisibleElementObserverOptions {
  children: React.ReactNode;
  useWrapperDiv: boolean;
  selector: string;
  intersectionOptions: IntersectionObserverInit | undefined;
}

export function VisibleElementObserver({
  children,
  useWrapperDiv,
  selector,
  intersectionOptions = {},
}: VisibleElementObserverOptions): React.ReactElement {
  const [visibleElements, { add, remove }] = useSet<Element>();
  const intersectionObserver = React.useRef<IntersectionObserver | null>();
  const handleIntersect = React.useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((e) =>
        e.isIntersecting ? add(e.target) : remove(e.target),
      );
    },
    [add, remove],
  );
  const observe = React.useCallback(
    (item: Element) => {
      if (intersectionObserver.current == null) {
        throw new Error(
          "Observed element mount with null intersection observer",
        );
      }
      intersectionObserver.current.observe(item);
    },
    [intersectionObserver],
  );
  const unobserve = React.useCallback(
    (item: Element) => {
      if (intersectionObserver.current == null) {
        throw new Error(
          "Observed element unmount with null intersection observer",
        );
      }
      intersectionObserver.current.unobserve(item);
    },
    [intersectionObserver],
  );
  const [mountedElements, observedTree] = useElementObserver({
    tree: children,
    selector,
    useWrapperDiv,
    onMount: observe,
    onUnmount: unobserve,
  });
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      handleIntersect,
      intersectionOptions,
    );
    intersectionObserver.current = observer;
    return (): void => {
      observer.disconnect();
      intersectionObserver.current = null;
    };
  }, [handleIntersect, intersectionOptions]);
  React.useEffect(
    () => {
      const observer = intersectionObserver.current;
      if (observer != null) {
        mountedElements.forEach((s) => observer.observe(s));
      }
    },
    // mountedElements is intentionally left out of the useEffect dependencies
    // array. We don't want to recreate the intersection observer everytime the
    // set of mounted elements changes. Instead, we hear about incremental
    // changes from the onMount/onUnmount callbacks.
    //
    // @TODO Okay then, just get rid of this Set and expose everything through
    // the callback methods.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [intersectionObserver.current],
  );

  return (
    <VisibleElementsContext.Provider value={visibleElements}>
      {observedTree}
    </VisibleElementsContext.Provider>
  );
}

export function useVisibleElements(): Set<Element> {
  const value = React.useContext(VisibleElementsContext);
  if (value == null) {
    throw new Error(
      `useVisibleElements must be used within a context provider`,
    );
  }
  return value;
}
