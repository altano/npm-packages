import { getInterPath } from "@altano/assets";
import { readFile } from "node:fs/promises";
import type { SatoriOptions } from "satori";
import type { SvgOptionsWithFontPaths } from "../../../src/integration.js";

export type SvgOptions = SatoriOptions;

// export async function getSvgDefaultOptions(): Promise<SvgOptionsWithFontPaths> {
//   const interRegularBuffer = await readFile(getInterPath(400));
//   const interBoldBuffer = await readFile(getInterPath(700));
//   return {
//     width: 300,
//     height: 300,
//     fonts: [
//       {
//         name: "Inter",
//         data: interRegularBuffer,
//         weight: 400,
//         style: "normal",
//       },
//       {
//         name: "Inter",
//         data: interBoldBuffer,
//         weight: 800,
//         style: "normal",
//       },
//     ],
//   };
// }

export async function getSvgDefaultOptions(): Promise<SvgOptionsWithFontPaths> {
  // const interRegularBuffer = await readFile(getInterPath(400));
  // const interBoldBuffer = await readFile(getInterPath(700));
  return {
    width: 300,
    height: 300,
    fonts: [
      {
        name: "Inter",
        path: getInterPath(400),
        weight: 400,
        style: "normal",
      },
      {
        name: "Inter",
        path: getInterPath(700),
        weight: 800,
        style: "normal",
      },
    ],
  };
}
