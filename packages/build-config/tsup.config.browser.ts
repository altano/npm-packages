import { defineConfig, type Options } from "tsup";
import unpluginIsolatedDecl from "unplugin-isolated-decl/esbuild";
import { rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { rollup } from "rollup";
import dts from "rollup-plugin-dts";

const unbundledDeclarations = "temp-before-bundling";

const config:
  | Options
  | Options[]
  | ((
      overrideOptions: Options,
    ) => Options | Options[] | Promise<Options | Options[]>) = defineConfig([
  {
    // since we're bundling, index is the only entry
    entry: ["./src/index.ts"],
    format: "esm",
    clean: true,
    platform: "browser",
    bundle: true,
    minify: false,
    outDir: "dist",
    splitting: false,
    dts: false,
    // Generate type declarations (XXXX.d.ts)
    esbuildPlugins: [
      unpluginIsolatedDecl({
        autoAddExts: true,
        extraOutdir: unbundledDeclarations,
        transformer: "typescript",
      }),
    ],
    // Bundle type declarations (index.d.ts)
    async onSuccess() {
      try {
        const build = await rollup({
          input: `./dist/${unbundledDeclarations}/index.d.ts`,
          plugins: [dts()],
          external(id) {
            return id[0] !== "." && !path.isAbsolute(id);
          },
        });

        await build.write({
          dir: "dist",
          format: "es",
          entryFileNames: (chunk) => {
            let filename = chunk.name;
            if (!filename.endsWith(".d")) filename += ".d";
            return `${filename}.ts`;
          },
        });
      } finally {
        await rm(path.resolve(process.cwd(), "dist/temp-before-bundling"), {
          recursive: true,
        });
      }
    },
  },
]);

export default config;
