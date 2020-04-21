/// <reference types="react" />
import React from "react";
interface VisibleElementObserverOptions {
    children: React.ReactNode;
    useWrapperDiv?: boolean;
    selector: string;
    intersectionOptions?: IntersectionObserverInit;
}
declare function VisibleElementObserver({ children, useWrapperDiv, selector, intersectionOptions, }: VisibleElementObserverOptions): React.ReactElement;
declare function useVisibleElements(): Set<Element>;
export { VisibleElementObserverOptions, VisibleElementObserver, useVisibleElements };
