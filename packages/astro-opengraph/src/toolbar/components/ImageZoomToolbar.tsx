import type Preact from "preact";
import { ZoomButton } from "./ZoomButton.js";
import { ToolbarSection } from "./ToolbarSection.js";

export function ImageZoomToolbar({
  isHovered,
  imageSize,
  setImageSize,
}: {
  isHovered: boolean;
  imageSize: number;
  setImageSize: (size: number) => void;
}): Preact.JSX.Element {
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
