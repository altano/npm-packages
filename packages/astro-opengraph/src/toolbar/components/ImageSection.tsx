import { Image } from "./Image.js";
import { ImageZoomToolbar } from "./ImageZoomToolbar.js";
import { CopyImageUrlButton } from "./CopyImageUrlButton.js";
import { useState } from "react";

export function ImageSection({
  isHovered,
}: {
  isHovered: boolean;
}): React.JSX.Element {
  const [imageSize, setImageSize] = useState(100);

  return (
    <>
      <Image imageSize={imageSize} />
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
