import type { ViteUserConfig } from "astro";

import type { OpengraphImageConfigSerializable } from "./types.js";

function resolveVirtualModuleId<T extends string>(id: T): `\0${T}` {
  return `\0${id}`;
}

/**
 * Vite plugin that exposes OpengraphImage user config and project context via
 * virtual modules.
 */
export function vitePluginOpengraphImageUserConfig(
  config: OpengraphImageConfigSerializable,
): NonNullable<ViteUserConfig["plugins"]>[number] {
  /** Map of virtual module names to their code contents as strings. */
  const modules = {
    "virtual:astro-opengraph/user-config": `export default ${JSON.stringify(
      config,
    )}`,
  } satisfies Record<string, string>;

  /** Mapping names prefixed with `\0` to their original form. */
  const resolutionMap = Object.fromEntries(
    (Object.keys(modules) as (keyof typeof modules)[]).map((key) => [
      resolveVirtualModuleId(key),
      key,
    ]),
  );

  return {
    name: "vite-plugin-astro-opengraph-user-config",
    resolveId(id): string | void {
      if (id in modules) return resolveVirtualModuleId(id);
    },
    load(id): string | void {
      const resolution = resolutionMap[id];
      if (resolution) return modules[resolution];
    },
  };
}
