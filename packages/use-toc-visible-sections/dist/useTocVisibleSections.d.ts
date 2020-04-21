import { VisibleElementObserverOptions, VisibleElementObserver } from "@altano/use-visible-elements";
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
declare function useVisibilityOfTarget(href: string): boolean;
type Options = WithOptional<VisibleElementObserverOptions, "selector">;
declare function TocVisibleSectionObserver(options: Options): ReturnType<typeof VisibleElementObserver>;
export { useVisibilityOfTarget, TocVisibleSectionObserver };
