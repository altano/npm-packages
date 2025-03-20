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

const ImageDefaults = {
  format: "png",
} as const;

const SvgDefaults = {
  width: 1200,
  height: 630,
} as const;

export async function getResolvedConfig(): Promise<OpengraphImageConfigResolved> {
  // Grab the virtual module that holds the integration's user config
  const module = await import("virtual:opengraph-image/user-config");
  const lazyConfig = module.default;
  const deserialized = await deserializeVirtualConfig(lazyConfig);
  return {
    ...ImageDefaults,
    ...deserialized,
    svgOptions: {
      ...SvgDefaults,
      ...deserialized.svgOptions,
    },
  };
}
