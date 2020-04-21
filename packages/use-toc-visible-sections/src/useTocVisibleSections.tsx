import React from "react";

import {
  VisibleElementObserverOptions,
  VisibleElementObserver,
  useVisibleElements,
} from "@altano/use-visible-elements";

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export function useVisibilityOfTarget(href: string): boolean {
  const visibleElements = useVisibleElements();
  return [...visibleElements].some((s) => s.querySelector(href));
}

type Options = WithOptional<VisibleElementObserverOptions, "selector">;

export function TocVisibleSectionObserver(
  options: Options,
): ReturnType<typeof VisibleElementObserver> {
  return <VisibleElementObserver selector="article section" {...options} />;
}
