/// <reference types="react" />
import React from "react";
declare function useVisibilityOfTarget(href: string): boolean;
interface VisibleElementObserverOptions {
  children: React.ReactNode;
  useWrapperDiv: boolean;
  selector: string;
  intersectionOptions: IntersectionObserverInit | undefined;
}
declare function VisibleElementObserver({
  children,
  useWrapperDiv,
  selector,
  intersectionOptions,
}: VisibleElementObserverOptions): JSX.Element;
declare function useVisibleElements(): Set<Element>;
export { useVisibilityOfTarget, VisibleElementObserver, useVisibleElements };
