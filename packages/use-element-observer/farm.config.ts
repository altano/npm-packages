import { defineConfig, type UserConfig } from "@farmfe/core";
import farmJsPluginDts from "@farmfe/js-plugin-dts";
import reactPlugin from "@farmfe/plugin-react";

const config: UserConfig = defineConfig({
  // Options related to the compilation
  compilation: {
    input: {
      // can be a relative path or an absolute path
      index: "./src/index.ts",
    },
    output: {
      path: "./dist/farm",
      publicPath: "/",
    },
    // ...
  },
  // Options related to the dev server
  server: {
    port: 9000,
    // ...
  },
  // Additional plugins
  plugins: [
    reactPlugin(),
    farmJsPluginDts({
      outputDir: "dist/farm/dts",
      tsConfigPath: "./tsconfig.json",
      compilerOptions: { allowJs: false },
    }),
  ],
});
export default config;
