import { defineConfig } from "vitest/config";
// import { resolve } from "node:path";
// import aliasExports from "@altano/vite-plugin-alias-exports";

export default defineConfig({
  plugins: [
    // aliasExports()
  ],
  resolve: {
    // alias: {
    //   "@altano/html-cdnify": resolve("./dist/index.js"),
    // },
    // alias: [
    //   { find: "@altano/html-cdnify", replacement: resolve("./dist/index.js") },
    // ],
  },
});
