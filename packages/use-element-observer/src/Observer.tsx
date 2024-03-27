import React, { useCallback, useContext } from "react";
import { useMountRef, type Callbacks } from "./useMountRef";
import { ElementObserverContext } from "./useElementObserver";

interface ChildrenAndCallbacks<T> extends Callbacks<T> {
  children: React.ReactNode;
}

function ObserveChildWithWrapperDiv({
  children,
  onMount,
  onUnmount,
}: ChildrenAndCallbacks<Element>): React.ReactElement {
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
}: ChildrenAndCallbacks<Element>): React.ReactElement {
  const newRef = useMountRef({ onMount, onUnmount });
  const child = React.Children.only(children);
  return React.cloneElement(child as React.ReactElement, { ref: newRef });
}

export function Observer({
  children,
  selector,
  useWrapperDiv,
}: {
  children: React.ReactNode;
  selector: string;
  useWrapperDiv: boolean;
}): React.ReactElement {
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
  const Component = useWrapperDiv ? ObserveChildWithWrapperDiv : ObserveChild;
  return (
    <Component onMount={onMount} onUnmount={onUnmount}>
      {children}
    </Component>
  );
}
