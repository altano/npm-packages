import React, { useCallback, useContext, useEffect, useRef } from "react";
import type { Actions } from "react-use/lib/useSet";
import useSet from "react-use/lib/useSet";

interface Context {
  mountedElements: Set<Element>;
  methods: Actions<Element>;
}

interface Callbacks<T> {
  onMount: (e: T) => void;
  onUnmount: (e: T) => void;
}

interface ChildrenAndCallbacks<T> extends Callbacks<T> {
  children: React.ReactNode;
}

const ElementObserverContext = React.createContext<Context | null>(null);

function useMountRef<T>({ onMount, onUnmount }: Callbacks<T>): React.Ref<T> {
  const newRef = useRef<T>(null);
  useEffect(() => {
    const ref = newRef.current;
    if (ref == null) {
      return (): void => {};
    }
    onMount(ref);
    return (): void => onUnmount(ref);
  }, [newRef, onMount, onUnmount]);
  return newRef;
}

function ObserveChildWithWrapperDiv({
  children,
  onMount,
  onUnmount,
}: ChildrenAndCallbacks<Element>): React.ReactElement {
  const ref = useMountRef<HTMLDivElement>({ onMount, onUnmount });
  return (
    <div style={{ all: "inherit" }} ref={ref}>
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

function Observer({
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
  const { methods } = context;
  const { add, reset } = methods;
  const onMount = useCallback(
    (ref: Element) => {
      Array.from(ref.querySelectorAll(selector)).forEach(add);
    },
    [selector, add],
  );
  const onUnmount = useCallback(() => reset, [reset]);
  const Component = useWrapperDiv ? ObserveChildWithWrapperDiv : ObserveChild;
  return (
    <Component onMount={onMount} onUnmount={onUnmount}>
      {children}
    </Component>
  );
}

interface Options {
  selector: string;
  tree: React.ReactNode;
  useWrapperDiv?: boolean;
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
export function useElementObserver({
  tree,
  selector,
  useWrapperDiv = true,
}: Options): [Set<Element>, React.ReactElement] {
  // @TODO Add mutation observer to catch changes to grandchildren?
  const [mountedElements, methods] = useSet<Element>();
  const observedTree = (
    <ElementObserverContext.Provider value={{ mountedElements, methods }}>
      <Observer selector={selector} useWrapperDiv={useWrapperDiv}>
        {tree}
      </Observer>
    </ElementObserverContext.Provider>
  );
  return [mountedElements, observedTree];
}
