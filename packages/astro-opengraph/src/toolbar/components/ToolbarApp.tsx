import React, { useState } from "react";
import { Summary } from "./Summary.js";
import { MetaTags } from "./MetaTags.js";
import { useHoverState } from "../hooks/useHoverState.js";
import { useImageURLIfAvailable } from "../hooks/useImageURL.js";
import { ImageSection } from "./ImageSection.js";

export function ToolbarApp(): React.JSX.Element {
  const [isImageDetailsHovered, setIsImageDetailsHovered] = useState(false);
  const imageDetailsRef = useHoverState<HTMLDetailsElement>(
    setIsImageDetailsHovered,
  );
  const imageUrl = useImageURLIfAvailable();

  if (imageUrl == null) {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <astro-dev-toolbar-icon
          style={{ width: 24, height: 24 }}
          icon="warning"
        />{" "}
        No Open Graph image found on this page
      </div>
    );
  }

  return (
    <>
      <details open className="image" ref={imageDetailsRef}>
        <Summary>Image</Summary>
        <ImageSection isHovered={isImageDetailsHovered} />
      </details>

      <details>
        <Summary>Meta Tags</Summary>
        <MetaTags />
      </details>
    </>
  );
}
