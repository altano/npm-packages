import type { VisibleElementChangedEvent } from "../types";

const tag = "anchor-current-setter";

/**
 * Make any descendant anchor have the `aria-current=true` attribute whenever its target (i.e. `<a href=#abc>...</a>` targets #abc) is visible (or whenever its target is the child of a visible element).
 *
 * @element anchor-current-setter
 *
 * @slot - Arbitrary child nodes containing anchor elements. Will update descendant anchors as appropriate.
 */
export class AnchorCurrentSetter extends HTMLElement {
  static define(): void {
    customElements.define(tag, this);
  }

  #connectedController: AbortController;

  constructor() {
    super();
    this.#connectedController = new AbortController();
  }

  connectedCallback(): void {
    this.#connectedController?.abort();
    this.#connectedController = new AbortController();
    this.ownerDocument.addEventListener(
      "visible-element-change",
      this.#handleVisibleElementChange.bind(this),
      { signal: this.#connectedController.signal },
    );
  }

  disconnectedCallback(): void {
    this.#connectedController.abort();
  }

  #handleVisibleElementChange(evt: VisibleElementChangedEvent): void {
    const visibleItem = evt.detail.item;
    const isAdding = evt.detail.isIntersecting === true;
    const idElements = visibleItem.querySelectorAll("[id]");
    const anchors = Array.from(idElements).flatMap((idElement) => {
      const id = idElement.getAttribute("id");
      if (id == null) {
        return [];
      }
      return Array.from(this.querySelectorAll(`a[href="#${id}"]`));
    });

    if (isAdding) {
      anchors.forEach((a) => a.setAttribute("aria-current", "true"));
    } else {
      anchors.forEach((a) => a.removeAttribute("aria-current"));
    }
  }
}

AnchorCurrentSetter.define();

declare global {
  interface HTMLElementTagNameMap {
    [tag]: AnchorCurrentSetter;
  }
}
