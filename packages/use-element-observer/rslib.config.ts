import { defineConfig, type RslibConfig } from "@rslib/core";
// import { pluginReact } from "@rsbuild/plugin-react";
// import { pluginDts } from "rsbuild-plugin-dts";

const config: RslibConfig = defineConfig({
  mode: "production",
  source: {
    include: ["./src/index.ts"],
    tsconfigPath: "./tsconfig.json",
  },
  lib: [
    {
      dts: {
        // bundle: false,
        bundle: true,
        distPath: "dist/rslib/dts",
      },
      format: "esm",
      // autoExternal: {
      //   dependencies: true,
      //   peerDependencies: true,
      //   devDependencies: false,
      // },
      // autoExtension: true,
      syntax: "esnext",
    },
  ],
  output: {
    distPath: {
      root: "dist/rslib/",
    },
  },
  // source: {
  //   entry: {
  //     index: "./src/index.ts",
  //   },
  // },
  plugins: [
    // pluginReact(),
    // pluginDts({
    //   // bundle: true,
    //   // distPath: "dist/rslib/dts",
    // }),
  ],
});

export default config;
