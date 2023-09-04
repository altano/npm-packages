import { useState } from "react";
import FitText from "./FitText";

export default function Playground() {
  const [text, setText] = useState(
    "asdofi ajsdofi ajpsdofi japsodif japsoid fjapoisd jfpaoisdj fpaoisd jfpoais djfpoia sdjfpoisadf",
  );
  const [lineHeight, setLineHeight] = useState(1.1);
  const [width, setWidth] = useState(1706);
  const [height, setHeight] = useState(500);
  const [weight, setWeight] = useState(600);

  return (
    <div className="wrapper">
      <div
        className="settings"
        style={{
          display: "grid",
          gridTemplateColumns: "max-content max-content max-content",
          gridGap: 5,
          marginBottom: "2rem",
        }}
      >
        <label style={{ textAlign: "right" }}>Text:</label>
        <input
          type="text"
          value={text}
          placeholder="Enter some text..."
          onChange={(el) => setText(el.target.value)}
          style={{ width: 600 }}
        />
        <span></span>
        <label style={{ textAlign: "right" }}>Width:</label>
        <input
          type="range"
          min={10}
          max={10000}
          value={width}
          onChange={(el) => setWidth(Number(el.target.value))}
        />
        {new Intl.NumberFormat().format(width)}px
        <label style={{ textAlign: "right" }}>Height:</label>
        <input
          type="range"
          min={10}
          max={10000}
          value={height}
          onChange={(el) => setHeight(Number(el.target.value))}
        />
        {new Intl.NumberFormat().format(height)}px
        <label style={{ textAlign: "right" }}>Line Height:</label>
        <input
          type="range"
          min={0.1}
          max={10}
          step={0.1}
          value={lineHeight}
          onChange={(el) => setLineHeight(Number(el.target.value))}
        />
        {lineHeight}
        <label style={{ textAlign: "right" }}>Font Weight:</label>
        <input
          type="range"
          min={100}
          max={900}
          step={100}
          value={weight}
          onChange={(el) => setWeight(Number(el.target.value))}
        />
        {weight}
      </div>
      <FitText
        lineHeight={lineHeight}
        height={height}
        width={width}
        text={text}
        weight={weight}
        background="skyblue"
      />
    </div>
  );
}
