import { Image } from "./Image.js";
import { ImageZoomToolbar } from "./ImageZoomToolbar.js";
import { CopyImageUrlButton } from "./CopyImageUrlButton.js";
import type Preact from "preact";
import { useState } from "preact/hooks";

export function ImageSection({
  isHovered,
  handleLoadError,
}: {
  isHovered: boolean;
  handleLoadError: () => void;
}): Preact.JSX.Element {
  const [imageSize, setImageSize] = useState(100);

  return (
    <>
      <Image imageSize={imageSize} handleLoadError={handleLoadError} />
      <div
        data-testid="image-section-toolbar"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          columnGap: 15,
        }}
      >
        <CopyImageUrlButton />
        <ImageZoomToolbar
          isHovered={isHovered}
          imageSize={imageSize}
          setImageSize={setImageSize}
        />
      </div>
    </>
  );
}
