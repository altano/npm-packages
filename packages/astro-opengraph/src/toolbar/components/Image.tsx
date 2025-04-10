import type Preact from "preact";
import { useImageURL } from "../hooks/useImageURL.js";

export function Image({
  imageSize,
  handleLoadError,
}: {
  imageSize: number;
  handleLoadError: () => void;
}): Preact.JSX.Element {
  const imageUrl = useImageURL();
  return (
    <div className="image">
      <a href={imageUrl} target="_blank" title="Open image in new tab">
        <img
          onError={handleLoadError}
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
