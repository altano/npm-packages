type EventDetail = {
  item: Element;
  isIntersecting: boolean;
};

export interface VisibleElementChangedEvent
  extends CustomEventInit<EventDetail> {
  // Make detail required
  detail: EventDetail;
}

declare global {
  interface GlobalEventHandlersEventMap {
    "visible-element-change": VisibleElementChangedEvent;
  }
}
