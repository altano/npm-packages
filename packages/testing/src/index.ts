import { defineConfig, mergeConfig, type ViteUserConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export const deriveConfig = (overrides: ViteUserConfig): ViteUserConfig =>
  mergeConfig(baseConfig, overrides);

export const deriveReactLibraryConfig = (
  overrides: ViteUserConfig,
): ViteUserConfig => mergeConfig(reactBaseConfig, overrides);

const baseConfig = defineConfig({
  // So we can use `using` in ts (https://github.com/vitejs/vite/issues/15464#issuecomment-1872485703)
  esbuild: {
    target: "es2020",
  },
  test: {
    dir: "tests/unit",
    setupFiles: ["@altano/testing/setup"],
    coverage: {
      enabled: true,
      include: ["src"],
      provider: "v8",
      all: true,
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
