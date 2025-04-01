import React, { useCallback, useContext } from "react";
import { useMountRef, type Callbacks } from "./useMountRef";
import { ElementObserverContext } from "./useElementObserver";
import type { ReactElementWithRef } from "./types";

interface ChildrenAndCallbacks<T, ChildType> extends Callbacks<T> {
  children: ChildType;
}

function ObserveChildWithWrapperDiv({
  children,
  onMount,
  onUnmount,
}: ChildrenAndCallbacks<Element, React.ReactNode>): React.ReactElement {
  const ref = useMountRef<HTMLDivElement>({ onMount, onUnmount });
  return (
    <div style={{ display: "inherit" }} ref={ref}>
      {children}
    </div>
  );
}

function ObserveChild({
  children,
  onMount,
  onUnmount,
}: ChildrenAndCallbacks<Element, ReactElementWithRef>): React.ReactElement {
  const newRef = useMountRef({ onMount, onUnmount });
  return React.cloneElement(children, { ref: newRef });
}

type Options =
  | {
      // If we're using a wrapper div...
      useWrapperDiv: true;
      // ... the children can be any ReactNode
      children: React.ReactNode;
      selector: string;
    }
  | {
      // But if we're not using a wrapper div...
      useWrapperDiv: false;
      // The child must be a single ReactElement that takes a ref
      children: ReactElementWithRef;
      selector: string;
    };

export function Observer({
  children,
  selector,
  useWrapperDiv,
}: Options): React.ReactElement {
  const context = useContext(ElementObserverContext);
  if (context == null) {
    throw new Error("Observer context was null");
  }
  const { mountedElements } = context;
  const onMount = useCallback(
    (ref: Element) => {
      Array.from(ref.querySelectorAll(selector)).forEach((e) =>
        mountedElements.add(e),
      );
    },
    [selector, mountedElements],
  );
  const onUnmount = useCallback(
    () => mountedElements.clear(),
    [mountedElements],
  );
  return useWrapperDiv ? (
    <ObserveChildWithWrapperDiv onMount={onMount} onUnmount={onUnmount}>
      {children}
    </ObserveChildWithWrapperDiv>
  ) : (
    <ObserveChild onMount={onMount} onUnmount={onUnmount}>
      {children}
    </ObserveChild>
  );
}
