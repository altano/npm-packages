import { useState } from "react";
import FitText from "./FitText.js";
import type { Font } from "@altano/satori-fit-text";

function assertWeightValid(
  weight: number,
): asserts weight is NonNullable<Font["weight"]> {
  if (![100, 200, 300, 400, 500, 600, 700, 800, 900].includes(weight)) {
    throw new Error(`Weight ${weight} is not a valid font-weight`);
  }
}

export default function Playground(): React.ReactElement {
  const [text, setText] = useState(
    "asdofi ajsdofi ajpsdofi japsodif japsoid fjapoisd jfpaoisdj fpaoisd jfpoais djfpoia sdjfpoisadf",
  );
  const [lineHeight, setLineHeight] = useState(1.1);
  const [width, setWidth] = useState(1706);
  const [height, setHeight] = useState(500);
  const [weight, setWeight] = useState(600);
  const [fontSizeOverride, setFontSizeOverride] = useState<number | null>(null);

  assertWeightValid(weight);

  return (
    <div className="wrapper">
      <div
        className="settings"
        style={{
          display: "grid",
          gridTemplateColumns: "max-content 75px",
          gridGap: 5,
          marginBottom: "2rem",
        }}
      >
        <label style={{ textAlign: "right", gridColumn: "span 2" }}>
          Text:
          <input
            type="text"
            value={text}
            placeholder="Enter some text..."
            onChange={(el) => setText(el.target.value)}
            style={{ width: 600 }}
          />
        </label>
        <label style={{ textAlign: "right" }}>
          Width:
          <input
            type="range"
            min={10}
            max={10000}
            value={width}
            onChange={(el) => setWidth(Number(el.target.value))}
          />
        </label>
        {new Intl.NumberFormat().format(width)}px
        <label style={{ textAlign: "right" }}>
          Height:
          <input
            type="range"
            min={10}
            max={10000}
            value={height}
            onChange={(el) => setHeight(Number(el.target.value))}
          />
        </label>
        {new Intl.NumberFormat().format(height)}px
        <label style={{ textAlign: "right" }}>
          Line Height:
          <input
            type="range"
            min={0.1}
            max={10}
            step={0.1}
            value={lineHeight}
            onChange={(el) => setLineHeight(Number(el.target.value))}
          />
        </label>
        {lineHeight}
        <label style={{ textAlign: "right" }}>
          Font Weight:
          <input
            type="range"
            min={100}
            max={900}
            step={100}
            value={weight}
            onChange={(el) => setWeight(Number(el.target.value))}
          />
        </label>
        {weight}
        <label style={{ textAlign: "right" }}>
          Font Size Override:
          <input
            type="number"
            value={fontSizeOverride ?? ""}
            onChange={(el) =>
              setFontSizeOverride(
                el.target.value ? Number(el.target.value) : null,
              )
            }
          />
        </label>
        {fontSizeOverride ? `${fontSizeOverride}px` : "none"}
      </div>
      <FitText
        lineHeight={lineHeight}
        height={height}
        width={width}
        text={text}
        weight={weight}
        background="skyblue"
        fontSizeOverride={fontSizeOverride}
      />
    </div>
  );
}
