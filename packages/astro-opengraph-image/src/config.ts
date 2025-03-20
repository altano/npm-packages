import { readFile } from "node:fs/promises";

import type {
  FontWithBuffer,
  OpengraphImageConfigResolved,
  OpengraphImageConfigSerializableMaybeMocked,
} from "./integration";

export async function deserializeVirtualConfig(
  configMaybeMocked: OpengraphImageConfigSerializableMaybeMocked,
): Promise<OpengraphImageConfigResolved> {
  const config =
    typeof configMaybeMocked === "function"
      ? configMaybeMocked() // We're running in vitest which is only capable of mocking functions
      : configMaybeMocked;
  const fontsWithBuffers: FontWithBuffer[] = await Promise.all(
    config.svgOptions.fonts.map(async (font) => {
      const data = await readFile(font.path);
      return {
        ...font,
        data: data,
      };
    }),
  );

  return {
    ...config,
    svgOptions: {
      ...config.svgOptions,
      fonts: fontsWithBuffers,
    },
  };
}
