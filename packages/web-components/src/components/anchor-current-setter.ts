import type { VisibleElementChangedEvent } from "../types";

const tag = "anchor-current-setter";

/**
 * When an element's visibility changes, get the first descendant with a `id`
 * attribute and mark any links that target it (i.e. `<a href=#abc>...</a>`
 * targets #abc) as having `aria-current=true`
 *
 * @element anchor-current-setter
 *
 * @slot - Arbitrary child nodes containing anchor elements. Will update
 * descendant anchors as appropriate.
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
    // get the first descendant element with an id
    const idElement = visibleItem.querySelector("[id]");
    const id = idElement?.getAttribute("id");

    // console.log({
    //   visibleItem: `${visibleItem.tagName} ${visibleItem.firstElementChild?.tagName}[id=${visibleItem.firstElementChild?.id}]`,
    //   isAdding,
    //   idElement: `#${idElement?.id}`,
    // });

    if (id == null) {
      return;
    }

    // Get all anchors that target that id
    const anchors = this.querySelectorAll<HTMLAnchorElement>(
      `a[href="#${id}"]`,
    );

    if (isAdding) {
      // anchors.forEach((a) => {
      //   console.log(`${a.hash} => aria-current=true`);
      // });
      anchors.forEach((a) => a.setAttribute("aria-current", "true"));
    } else {
      // anchors.forEach((a) => {
      //   console.log(`${a.hash} => invisible`);
      // });
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
