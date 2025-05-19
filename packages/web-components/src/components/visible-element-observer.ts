import type { VisibleElementChangedEvent } from "../types";

const tag = "visible-element-observer";

/**
 * Observes its children for visibility using IntersectionObserver. An event is fired whenever the visibility changes for a descendant that matches the data-selector attribute.
 *
 * @element visible-element-observer
 *
 * @fires visible-element-change - Event that is fired whenever the visibility of an observed descendant changes.
 *
 * @attr {String} data-selector - Only descendant elements which match this selector will have their visibility observed. Can be ommitted (or set to `*`) to match all descendant elements.
 *
 * @slot - Arbitrary child nodes. Will be observed for visibility changes.
 */
export class VisibleElementObserver extends HTMLElement {
  static define(): void {
    customElements.define(tag, this);
  }

  #intersectionObserverController: AbortController;
  #mutationObserverController: AbortController;

  constructor() {
    super();
    this.#intersectionObserverController = new AbortController();
    this.#mutationObserverController = new AbortController();
  }

  connectedCallback(): void {
    this.#observeMatchedElementsForVisibility();
    this.#observeSubtreeForMutations();
  }

  disconnectedCallback(): void {
    this.#intersectionObserverController.abort();
    this.#mutationObserverController.abort();
  }

  #notify(item: Element, isIntersecting: boolean): void {
    this.ownerDocument.dispatchEvent(
      new CustomEvent("visible-element-change", {
        detail: { item, isIntersecting },
      }) satisfies VisibleElementChangedEvent,
    );
  }

  #observeSubtreeForMutations(): void {
    // disconnect obsoleted mutation observer
    this.#mutationObserverController.abort();
    this.#mutationObserverController = new AbortController();

    const observer = new MutationObserver(() => {
      this.#observeMatchedElementsForVisibility();
    });
    observer.observe(this, {
      childList: true,
      subtree: true,
    });

    this.#mutationObserverController.signal.addEventListener("abort", () => {
      observer.disconnect();
    });
  }

  #observeMatchedElementsForVisibility(): void {
    // disconnect obsoleted intersection observer
    this.#intersectionObserverController.abort();
    this.#intersectionObserverController = new AbortController();

    const selector = this.getAttribute("data-selector") ?? "*";

    const handleIntersect = (entries: IntersectionObserverEntry[]): void => {
      entries.forEach((e) => this.#notify(e.target, e.isIntersecting));
    };

    const observer = new IntersectionObserver(handleIntersect);
    const matchedElements = this.querySelectorAll(selector) ?? [];
    Array.from(matchedElements).forEach((e) => observer.observe(e));

    this.#intersectionObserverController.signal.addEventListener("abort", () =>
      observer.disconnect(),
    );
  }
}

VisibleElementObserver.define();

declare global {
  interface HTMLElementTagNameMap {
    [tag]: VisibleElementObserver;
  }
}
