import { defineConfig, type RsbuildConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginDts } from "rsbuild-plugin-dts";

const config: RsbuildConfig = defineConfig({
  source: {
    entry: {
      index: "./src/index.ts",
    },
  },
  output: {
    distPath: {
      root: "dist/rsbuild/",
    },
  },
  plugins: [
    pluginReact(),
    pluginDts({
      // bundle: true,
      distPath: "dist/rsbuild/dts",
    }),
  ],
});

export default config;
