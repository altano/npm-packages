import React from "react";

import {
  VisibleElementObserver,
  useVisibleElements,
} from "@altano/use-visible-elements";

export function useVisibilityOfTarget(href: string): boolean {
  const visibleElements = useVisibleElements();
  return [...visibleElements].some((s) => s.querySelector(href));
}

type Options =
  | {
      // We can have an arbitrary # of children if ...
      children: React.ReactNode;
      // ... we're using a wrapper div
      useWrapperDiv?: true;
      selector?: string;
      intersectionOptions?: IntersectionObserverInit;
    }
  | {
      // We must have a single child if ...
      children: React.ReactElement;
      // ... we're not using a wrapper div
      useWrapperDiv: false;
      selector?: string;
      intersectionOptions?: IntersectionObserverInit;
    };

export function TocVisibleSectionObserver(
  options: Options,
): ReturnType<typeof VisibleElementObserver> {
  return <VisibleElementObserver selector="article section" {...options} />;
}
