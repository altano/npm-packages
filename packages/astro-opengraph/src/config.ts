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
    config.imageOptions.fonts.map(async (font) => {
      const data = await readFile(font.path);
      return {
        ...font,
        data: data,
      };
    }),
  );

  return {
    ...config,
    imageOptions: {
      ...config.imageOptions,
      fonts: fontsWithBuffers,
    },
  };
}

const imageOptionDefaults = {
  width: 1200,
  height: 630,
} as const;

const metaTagDefaults: MetaTagDefaults = {
  "og:image": `/opengraph.png`,
};

export async function getResolvedConfig(): Promise<OpengraphImageConfigResolved> {
  // Grab the virtual module that holds the integration's user config
  const module = await import("virtual:astro-opengraph/user-config");
  const lazyConfig = module.default;
  const deserialized = await deserializeVirtualConfig(lazyConfig);
  return {
    ...deserialized,
    imageOptions: {
      ...imageOptionDefaults,
      ...deserialized.imageOptions,
    },
    componentMetaTagFallbacks: {
      ...deserialized.componentMetaTagFallbacks,
      ...metaTagDefaults,
    },
  };
}
