import { defineConfig } from "rolldown";
import UnpluginIsolatedDecl from "unplugin-isolated-decl/rolldown";

export default defineConfig({
  input: "./src/index.ts",
  output: {
    dir: "dist/rolldown",
    format: "module",
  },
  platform: "browser",
  treeshake: true,
  external: ["react", "react/jsx-runtime", "@uidotdev/usehooks"],

  // https://github.com/rolldown/rolldown/blob/dab103ff12538a3f23ecbd94d939568a22bf6d24/examples/basic-typescript/rolldown.config.js
  resolve: {
    // This needs to be explicitly set for now because oxc resolver doesn't
    // assume default exports conditions. Rolldown will ship with a default that
    // aligns with Vite in the future.
    conditionNames: ["import"],
  },

  // plugins: [
  //   // https://github.com/unplugin/unplugin-isolated-decl
  //   UnpluginIsolatedDecl({
  //     // transformer: "typescript",
  //     // transformer: "swc",
  //     transformer: "oxc",
  //   }),
  // ],
});
