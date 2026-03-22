import { defineConfig, mergeConfig, type ViteUserConfig } from "vitest/config";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";

export type { ViteUserConfig as TestingConfig } from "vitest/config";

/**
 * Vite plugin that marks v8 coverage ignore comments with @preserve so
 * esbuild keeps them during transformation. Without this, esbuild strips
 * the comments and v8 coverage ignore directives have no effect.
 */
function preserveV8IgnoreComments(): Plugin {
  return {
    name: "preserve-v8-ignore-comments",
    enforce: "pre",
    transform(code, id) {
      if (!id.includes("node_modules") && code.includes("v8 ignore")) {
        return code.replace(
          /\/\*\s*(v8 ignore\b[^*]*)\*\//g,
          "/* $1 -- @preserve */",
        );
      }
      return undefined;
    },
  };
}

export const deriveConfig = (overrides: ViteUserConfig): ViteUserConfig =>
  mergeConfig(baseConfig, overrides);

export const deriveConfigWithoutPlugins = (
  overrides: ViteUserConfig,
): ViteUserConfig => mergeConfig(noPluginsConfig, overrides);

export const deriveReactLibraryConfig = (
  overrides: ViteUserConfig,
): ViteUserConfig => mergeConfig(reactBaseConfig, overrides);

const noPluginsConfig = defineConfig({
  plugins: [preserveV8IgnoreComments()],
  // So we can use `using` in ts (https://github.com/vitejs/vite/issues/15464#issuecomment-1872485703)
  // or top-level await in unit tests
  esbuild: {
    target: "es2024",
  },
  test: {
    dir: "tests/unit",
    coverage: {
      enabled: true,
      include: ["src"],
      provider: "v8",
      clean: true,
      thresholds: { "100": true },
      reportsDirectory: ".coverage",
    },
    typecheck: {
      tsconfig: "tests/tsconfig.json",
      enabled: true,
    },
  },
});

const baseConfig = mergeConfig(noPluginsConfig, {
  test: {
    setupFiles: ["@altano/testing/setup"],
  },
});

const reactBaseConfig = mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [react()],
    test: {
      globals: true, // required by testing-library setup
      environment: "jsdom",
      setupFiles: ["@altano/testing/setup-dom"],
      restoreMocks: true,
    },
  }),
);
