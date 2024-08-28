import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["./src/**/*.ts"],
    format: ["esm", "cjs"],
    outDir: "dist",
    dts: true,
    clean: true,
    platform: "node",
    bundle: false,
    minify: false,
    plugins: [
      {
        // Based on discussion in https://github.com/egoist/tsup/issues/953
        // require("./path.js") → require("./path.cjs") in `.cjs` files
        name: "fix-cjs-require",
        renderChunk(_, { code }) {
          if (this.format === "cjs") {
            const regex = /require\("(?<import>.+).js"\)/g;
            return { code: code.replace(regex, `require("$<import>.cjs")`) };
          }
        },
      },
    ],
  },
]);
