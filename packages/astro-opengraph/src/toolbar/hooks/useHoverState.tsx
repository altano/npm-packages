import React, { useRef, useEffect } from "react";

export function useHoverState<TElement extends HTMLElement>(
  setHoverState: React.Dispatch<React.SetStateAction<boolean>>,
): React.RefObject<TElement | null> {
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
