import type React from "react";
import { ZoomButton } from "./ZoomButton.js";
import { ToolbarSection } from "./ToolbarSection.js";

export function ImageZoomToolbar({
  isHovered,
  imageSize,
  setImageSize,
}: {
  isHovered: boolean;
  imageSize: number;
  setImageSize: React.Dispatch<React.SetStateAction<number>>;
}): React.JSX.Element {
  return (
    <ToolbarSection icon={<astro-dev-toolbar-icon icon="gear" />}>
      {!isHovered ? (
        <ZoomButton
          value={imageSize}
          imageSize={imageSize}
          setImageSize={setImageSize}
        />
      ) : (
        <>
          <ZoomButton
            value={25}
            imageSize={imageSize}
            setImageSize={setImageSize}
          />
          <ZoomButton
            value={50}
            imageSize={imageSize}
            setImageSize={setImageSize}
          />
          <ZoomButton
            value={75}
            imageSize={imageSize}
            setImageSize={setImageSize}
          />
          <ZoomButton
            value={100}
            imageSize={imageSize}
            setImageSize={setImageSize}
          />
        </>
      )}
    </ToolbarSection>
  );
}
