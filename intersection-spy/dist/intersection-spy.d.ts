interface Section {
  target: Element;
  heading: Element;
  navLink: HTMLAnchorElement;
  hash: string;
  isSelected: boolean;
  lastIntersectionObservationTime: number;
  intersectionRatio: number;
  intersectionRectArea: number;
}
interface ObserverOptions {
  rootMargin: string;
  getTarget: getTargetFn;
  navigationLinksSelector: string;
}
type getTargetFn = (e: Element) => Element;
declare class Observer {
  private observer;
  readonly rootMargin: string | undefined;
  readonly sections: Section[];
  readonly listenerRemovalFunctions: Array<() => void>;
  // @TODO replace this with something that snapshots the scroll position and
  // doesn't get reset until the scroll position changes?
  //
  // Use this mechanism to not activate the scroll spy until the scroll position
  // has changed at all (don't highlight anything on page load unless the hash
  // matches!)
  private ignoreNextIntersectionObserverCallback;
  constructor({
    rootMargin,
    getTarget,
    navigationLinksSelector,
  }: ObserverOptions);
  destroy(): void;
  setupSections(getTarget: getTargetFn, navigationLinksSelector: string): void;
  // tslint:disable-next-line:no-any
  filterElements(arr: any[]): Element[];
  removeAllSelections(): void;
  observeHashChange(): void;
  selectSection(section: Section): void;
  onHashChange(): void;
  observeSectionIntersection(): void;
  onIntersectionChange(entries: IntersectionObserverEntry[]): void;
  getVisibleRectArea(entry: IntersectionObserverEntry): number;
  getSectionToSelect(): Section | null;
}
export {Observer as default};
