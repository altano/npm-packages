import type Preact from "preact";
import { ZoomLabel } from "./ZoomLabel.js";

export function ZoomButton({
  value,
  imageSize,
  setImageSize,
}: {
  value: number;
  imageSize: number;
  setImageSize: (size: number) => void;
}): Preact.JSX.Element {
  const isSelected = value === imageSize;
  return (
    <astro-dev-toolbar-button
      size="small"
      style={{ padding: 0, margin: 0 }}
      buttonStyle={isSelected ? "gray" : "ghost"}
      className="zoom-button"
      role="radio"
      onClick={() => setImageSize(value)}
    >
      <ZoomLabel imageSize={value} />
    </astro-dev-toolbar-button>
  );
}
