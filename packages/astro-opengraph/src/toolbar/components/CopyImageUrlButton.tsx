import { useState, useRef, useEffect, useCallback } from "preact/hooks";
import type Preact from "preact";
import type { MouseEventHandler } from "preact/compat";
import type { DevToolbarButton } from "astro/runtime/client/dev-toolbar/ui-library/button.js";
import { useImageURL } from "../hooks/useImageURL.js";
import { ToolbarSection } from "./ToolbarSection.js";

type Timer = ReturnType<typeof setTimeout>;

export function CopyImageUrlButton(): Preact.JSX.Element {
  const imageUrl = useImageURL();
  const [wasRecentlyClicked, setWasRecentlyClicked] = useState(false);
  // Named `...Ref` so the react-hooks compiler rules recognize it as a ref.
  // `useRef` here is preact's, which they can't otherwise infer.
  const checkTimerRef = useRef<Timer | null>(null);

  useEffect(() => {
    if (wasRecentlyClicked && checkTimerRef.current == null) {
      checkTimerRef.current = setTimeout(() => {
        setWasRecentlyClicked(false);
        // TODO investigate
        // eslint-disable-next-line react-compiler/react-compiler
        checkTimerRef.current = null;
      }, 3_000);
    }
  }, [wasRecentlyClicked]);

  const handleClick: MouseEventHandler<DevToolbarButton> = useCallback(
    (evt) => {
      // Copy the text inside the text field
      void navigator.clipboard.writeText(imageUrl);
      setWasRecentlyClicked(true);
      evt.stopPropagation();
      evt.preventDefault();
    },
    [imageUrl],
  );

  return (
    <ToolbarSection icon={<astro-dev-toolbar-icon icon="copy" />}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <astro-dev-toolbar-button
          size="small"
          buttonStyle="gray"
          onClick={handleClick}
        >
          {wasRecentlyClicked ? "Copied to clipboard" : "Copy image URL"}
        </astro-dev-toolbar-button>
      </div>
    </ToolbarSection>
  );
}
