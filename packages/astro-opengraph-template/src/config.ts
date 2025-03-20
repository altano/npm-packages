import { readFile } from "node:fs/promises";

import type {
  FontWithBuffer,
  MetaTagDefaults,
  OpengraphImageConfigDeserialized,
  OpengraphImageConfigResolved,
  OpengraphImageConfigSerializableMaybeMocked,
} from "./types.js";

export async function deserializeVirtualConfig(
  configMaybeMocked: OpengraphImageConfigSerializableMaybeMocked,
): Promise<OpengraphImageConfigDeserialized> {
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

export const imageDefaults = {
  format: "png",
} as const;

const svgDefaults = {
  width: 1200,
  height: 630,
} as const;

const metaTagDefaults: MetaTagDefaults = {
  "og:image": `./opengraph.${imageDefaults.format}`,
};

export async function getResolvedConfig(): Promise<OpengraphImageConfigResolved> {
  // Grab the virtual module that holds the integration's user config
  const module = await import("virtual:astro-opengraph-template/user-config");
  const lazyConfig = module.default;
  const deserialized = await deserializeVirtualConfig(lazyConfig);
  return {
    ...deserialized,
    imageFormat: deserialized.imageFormat ?? imageDefaults.format,
    svgOptions: {
      ...svgDefaults,
      ...deserialized.svgOptions,
    },
    componentMetaTagFallbacks: {
      ...deserialized.componentMetaTagFallbacks,
      ...metaTagDefaults,
    },
  };
}
