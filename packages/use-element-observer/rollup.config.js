import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig({
  input: "./src/index.ts",
  output: {
    dir: "dist/rollup",
    format: "module",
  },
  plugins: [typescript({ outDir: "dist/rollup" })],
  external: ["react", "react/jsx-runtime", "@uidotdev/usehooks"],
});
