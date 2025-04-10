import type Preact from "preact";
import { useState } from "preact/hooks";
import { Summary } from "./Summary.js";
import { MetaTags } from "./MetaTags.js";
import { useHoverState } from "../hooks/useHoverState.js";
import { useImageURLIfAvailable } from "../hooks/useImageURL.js";
import { ImageSection } from "./ImageSection.js";
import { Error } from "./Error.js";
import { getRelativeUrl } from "./getRelativeUrl.js";

export function ToolbarApp(): Preact.JSX.Element {
  const [isImageDetailsHovered, setIsImageDetailsHovered] = useState(false);
  const imageDetailsRef = useHoverState<HTMLDetailsElement>(
    setIsImageDetailsHovered,
  );
  const imageUrl = useImageURLIfAvailable();
  const [imageLoadStatus, setImageLoadStatus] = useState<"pending" | "error">(
    "pending",
  );

  if (imageUrl == null) {
    return (
      <Error icon="warning" message="No Open Graph image found on this page" />
    );
  } else if (imageLoadStatus === "error") {
    return (
      <Error
        icon="bug"
        message={`Error loading image at ${getRelativeUrl(imageUrl)}`}
      />
    );
  }

  return (
    <>
      <details open className="image" ref={imageDetailsRef}>
        <Summary>Image</Summary>
        <ImageSection
          isHovered={isImageDetailsHovered}
          handleLoadError={() => setImageLoadStatus("error")}
        />
      </details>

      <details>
        <Summary>Meta Tags</Summary>
        <MetaTags />
      </details>
    </>
  );
}
