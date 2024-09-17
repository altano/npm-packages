import {
  useElementObserver,
  type ReactElementWithRef,
} from "@altano/use-element-observer";
import React from "react";
import { useSet } from "react-use";

type Context = Set<Element>;
export const VisibleElementsContext: React.Context<Context | null> =
  React.createContext<Context | null>(null);

export type VisibleElementObserverOptions = ChildOptions & {
  selector: string;
  intersectionOptions?: IntersectionObserverInit;
};

export type ChildOptions =
  | {
      useWrapperDiv: false;
      children: ReactElementWithRef;
    }
  | {
      useWrapperDiv: true;
      children: React.ReactNode;
    }
  | {
      useWrapperDiv?: undefined;
      children: React.ReactNode;
    };

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
  const [mountedElements, observedTree] = useElementObserver(
    useWrapperDiv == null || useWrapperDiv === true
      ? {
          tree: children,
          selector,
          useWrapperDiv: true,
        }
      : {
          tree: children,
          selector,
          useWrapperDiv: false,
        },
  );
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
