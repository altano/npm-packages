import React from "react";
import { useImageURL } from "../hooks/useImageURL.js";

export function Image({ imageSize }: { imageSize: number }): React.JSX.Element {
  const imageUrl = useImageURL();

  return (
    <div className="image">
      <a href={imageUrl} target="_blank" title="Open image in new tab">
        <img
          alt="Open Graph"
          src={imageUrl}
          style={{
            maxHeight: "100%",
            maxWidth: `${imageSize}%`,
          }}
        />
      </a>
    </div>
  );
}
