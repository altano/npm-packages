import {
  VisibleElementObserver,
  useVisibleElements,
  type ChildOptions,
} from "@altano/use-visible-elements";

export function useVisibilityOfTarget(href: string): boolean {
  const visibleElements = useVisibleElements();
  return [...visibleElements].some((s) => s.querySelector(`:scope > ${href}`));
}

type Options = ChildOptions & {
  selector?: string;
  intersectionOptions?: IntersectionObserverInit;
};

export function TocVisibleSectionObserver(
  options: Options,
): ReturnType<typeof VisibleElementObserver> {
  return <VisibleElementObserver selector="article section" {...options} />;
}
