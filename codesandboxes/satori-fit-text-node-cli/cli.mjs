import { parseArgs } from "node:util";
import { findLargestUsableFontSize } from "@altano/satori-fit-text";

async function getInter() {
  const interSemiBoldBuffer = await fetch(
    `https://files.terriblefish.com/fonts/Inter/v4/extras/otf/Inter-SemiBold.otf`,
  ).then((res) => res.arrayBuffer());

  return {
    name: "Inter",
    data: interSemiBoldBuffer,
    weight: 600,
  };
}

const {
  values: { width, height, text },
} = parseArgs({
  strict: true,
  options: {
    text: {
      type: "string",
      short: "t",
    },
    width: {
      type: "string",
      short: "w",
    },
    height: {
      type: "string",
      short: "h",
    },
  },
});

if (width == null || isNaN(Number(width))) {
  throw new Error(`Invalid width: ${width}`);
}

if (height == null || isNaN(Number(height))) {
  throw new Error(`Invalid height: ${height}`);
}

if (text == null || typeof text !== "string") {
  throw new Error(`Invalid text: ${text}`);
}

const largestUsableFontSize = await findLargestUsableFontSize({
  lineHeight: 1,
  font: await getInter(),
  text,
  maxWidth: Number(width),
  maxHeight: Number(height),
});

console.log(
  `Largest font-size you can use for the text "${text}" while fitting in ${width}x${height}px is ${largestUsableFontSize}px`,
);
