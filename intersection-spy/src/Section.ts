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

export default Section;
