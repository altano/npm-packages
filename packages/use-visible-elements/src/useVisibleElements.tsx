import { useElementObserver } from "@altano/use-element-observer";
import React from "react";
import { useSet } from "react-use";

type Context = Set<Element>;
const VisibleElementsContext = React.createContext<Context | null>(null);

export interface VisibleElementObserverOptions {
  children: React.ReactNode;
  useWrapperDiv?: boolean;
  selector: string;
  intersectionOptions?: IntersectionObserverInit;
}

export function VisibleElementObserver({
  children,
  useWrapperDiv,
  selector,
  intersectionOptions,
}: VisibleElementObserverOptions): React.ReactElement {
  const [visibleElements, { add, remove }] = useSet<Element>();
  const handleIntersect = React.useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((e) =>
        e.isIntersecting ? add(e.target) : remove(e.target),
      );
    },
    [add, remove],
  );
  const [mountedElements, observedTree] = useElementObserver({
    tree: children,
    selector,
    useWrapperDiv,
  });
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      handleIntersect,
      intersectionOptions,
    );
    mountedElements.forEach((e) => observer.observe(e));
    return () => {
      observer.disconnect();
    };
  }, [mountedElements, handleIntersect, intersectionOptions]);

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
