import React, { useEffect, useRef } from "react";

export interface Callbacks<T> {
  onMount: (e: T) => void;
  onUnmount: (e: T) => void;
}

export function useMountRef<T>({
  onMount,
  onUnmount,
}: Callbacks<T>): React.Ref<T> {
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
