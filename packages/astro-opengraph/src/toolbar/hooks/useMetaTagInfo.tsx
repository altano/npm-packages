import { useEffect, useRef, useState } from "preact/hooks";

export type MetaTagInfo = [content: string | null, property: string | null];

const useHeadObserver = (): React.RefObject<HTMLHeadElement | null> => {
  const [_generation, setGeneration] = useState<number>(0);
  const forceRerender = (): void => setGeneration((old) => ++old);
  const headRef = useRef(document.querySelector("head"));

  // useEffect(() => {
  //   console.log({ generation });
  // }, [generation]);

  useEffect(() => {
    // console.log({ "headRef.current": headRef.current });
    if (headRef.current == null) {
      // assume we must have a head by now, and if we don't, we will never get
      // one.
      return;
    }
    const observer = new MutationObserver(forceRerender);
    observer.observe(headRef.current, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, []);

  return headRef;
};

export function useMetaTagInfo(): MetaTagInfo[] {
  const headRef = useHeadObserver();
  const opengraphMetaTags =
    headRef?.current?.querySelectorAll("meta[property^='og:']") ?? [];
  // console.log({
  //   opengraphMetaTags: opengraphMetaTags,
  //   opengraphMetaTagsLength: opengraphMetaTags.length,
  // });
  return Array.from(opengraphMetaTags).map(
    (tag: Element): MetaTagInfo => [
      tag.getAttribute("content"),
      tag.getAttribute("property"),
    ],
  );
}
