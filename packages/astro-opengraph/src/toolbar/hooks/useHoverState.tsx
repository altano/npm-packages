import type Preact from "preact";
import { useRef, useEffect } from "preact/hooks";

export function useHoverState<TElement extends HTMLElement>(
  setHoverState: (isHover: boolean) => void,
): Preact.RefObject<TElement> {
  const ref = useRef<TElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    ref.current?.addEventListener("mouseenter", () => setHoverState(true), {
      signal,
    });
    ref.current?.addEventListener("mouseleave", () => setHoverState(false), {
      signal,
    });

    return () => controller.abort();
  }, [setHoverState]);

  return ref;
}
