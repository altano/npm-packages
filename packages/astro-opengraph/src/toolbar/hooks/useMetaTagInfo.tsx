export type MetaTagInfo = [content: string | null, property: string | null];

export function useMetaTagInfo(): MetaTagInfo[] {
  // Not the best code... reads DOM out of useEffect, doesn't listen for
  // mutations, etc. Oh well.
  return Array.from(document.querySelectorAll("meta[property^='og:']")).map(
    (tag: Element): MetaTagInfo => [
      tag.getAttribute("content"),
      tag.getAttribute("property"),
    ],
  );
}
