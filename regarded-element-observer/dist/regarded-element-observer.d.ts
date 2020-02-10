interface Section {
    target: Element;
    heading: Element;
    navLink: HTMLAnchorElement;
    hash: string;
    isSelected: boolean;
    lastIntersectionObservationTime: number;
    lastIntersectionRatio: number;
    intersectionRatio: number;
    intersectionRectArea: number;
}
interface ObserverOptions {
    rootElement?: HTMLElement;
    rootMargin: string;
    getElementToSpyFromLinkTarget: getElementToSpyFromLinkTargetFn;
    navigationLinksSelector: string;
    className?: string;
}
type getElementToSpyFromLinkTargetFn = (e: Element) => Element;
declare class Observer {
    private observer;
    readonly rootElement: HTMLElement;
    readonly rootMargin: string;
    readonly sections: Section[];
    readonly className: string;
    readonly listenerRemovalFunctions: Array<() => void>;
    // @TODO replace this with something that snapshots the scroll position and
    // doesn't get reset until the scroll position changes?
    //
    // Use this mechanism to not activate the scroll spy until the scroll position
    // has changed at all (don't highlight anything on page load unless the hash
    // matches!)
    private ignoreNextIntersectionObserverCallback;
    constructor({ className, getElementToSpyFromLinkTarget, navigationLinksSelector, rootElement, rootMargin }: ObserverOptions);
    destroy(): void;
    getAnchorsFromHash(hash: string): HTMLAnchorElement[];
    setupSections(getElementToSpyFromLinkTarget: getElementToSpyFromLinkTargetFn, navigationLinksSelector: string): void;
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
export { Observer as default };
