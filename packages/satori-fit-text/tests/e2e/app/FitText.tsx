import { type Font, findLargestUsableFontSize } from "@altano/satori-fit-text";
import { useState, useLayoutEffect } from "react";
import { getInter } from "./font.js";

export type Props = {
  text: string;
  lineHeight?: number;
  width: number;
  height: number;
  background?: string;
  weight?: Font["weight"];
};

export default function FitText({
  text,
  lineHeight = 1,
  width,
  height,
  background = "orangered",
  weight = 600,
}: Props): React.ReactElement {
  const [fontSize, setFontSize] = useState(0);
  const [timeToComputeMs, setTimeToComputeMs] = useState(0);

  useLayoutEffect(() => {
    async function findFontSize(): Promise<void> {
      performance.mark("findLargestUsableFontSize-start");
      const largestUsableFontSize = await findLargestUsableFontSize({
        lineHeight: lineHeight,
        font: await getInter(weight),
        text,
        maxWidth: width,
        maxHeight: height,
      });
      performance.mark("findLargestUsableFontSize-end");
      const measure = performance.measure(
        "findLargestUsableFontSize",
        "findLargestUsableFontSize-start",
        "findLargestUsableFontSize-end",
      );
      setTimeToComputeMs(measure.duration);
      setFontSize(largestUsableFontSize);

      // eslint-disable-next-line no-console
      console.log(
        `Largest font-size you can use for the text "${text.substring(
          0,
          30,
        )}" while fitting in ${width}x${height}px is ${largestUsableFontSize}px (found in ${
          measure.duration
        }ms)`,
      );
    }

    void findFontSize();
  }, [height, lineHeight, text, weight, width]);

  const style = {
    marginBlock: "1rem",
    lineHeight,
    width,
    height,
    background,
  };

  if (fontSize === 0) {
    return <div style={style}>Computing largest possible font size...</div>;
  }

  return (
    <div
      style={{
        ...style,
        border: "solid 3px black",
        position: "relative",
        fontWeight: weight,
        // transition: "font-size 500ms ease-out",
        fontSize,
      }}
    >
      {text}
      <span
        style={{
          position: "absolute",
          color: "black",
          fontSize: "16px",
          right: 5,
          bottom: 5,
        }}
      >
        {fontSize}px / {Math.round(timeToComputeMs)}ms
      </span>
    </div>
  );
}
