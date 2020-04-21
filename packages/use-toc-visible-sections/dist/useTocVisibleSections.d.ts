/// <reference types="react" />
import React from "react";
import { VisibleElementObserver } from "@altano/use-visible-elements";
declare function useVisibilityOfTarget(href: string): boolean;
type Options = {
    children: React.ReactNode;
    useWrapperDiv?: true;
    selector?: string;
    intersectionOptions?: IntersectionObserverInit;
} | {
    children: React.ReactElement;
    useWrapperDiv: false;
    selector?: string;
    intersectionOptions?: IntersectionObserverInit;
};
declare function TocVisibleSectionObserver(options: Options): ReturnType<typeof VisibleElementObserver>;
export { useVisibilityOfTarget, TocVisibleSectionObserver };
