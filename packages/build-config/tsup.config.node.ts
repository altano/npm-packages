import { defineConfig, type Options } from "tsup";
import unpluginIsolatedDecl from "unplugin-isolated-decl/esbuild";

const commonConfig: Options = {
  entry: ["./src/**/*.ts"],
  format: "esm",
  dts: false,
  clean: true,
  platform: "node",
  bundle: false,
  minify: false,
};

const config:
  | Options
  | Options[]
  | ((
      overrideOptions: Options,
    ) => Options | Options[] | Promise<Options | Options[]>) = defineConfig([
  {
    ...commonConfig,
    outDir: "dist/tsup",
    dts: true,
  },
  {
    ...commonConfig,
    outDir: "dist/tsup-tsc",
    onSuccess: "pnpm build:types --outDir dist/tsup-tsc",
    dts: false,
  },
  // Does not yet work with isolatedDeclarations
  // {
  //   ...commonConfig,
  //   outDir: "dist/tsup-api-extractor",
  //   dts: false,
  //   experimentalDts: true,
  // },
  {
    ...commonConfig,
    outDir: "dist/tsup-unplugin",
    dts: false,

    esbuildPlugins: [
      unpluginIsolatedDecl({
        autoAddExts: true,
        extraOutdir: "typescript",
        transformer: "typescript",
      }),
    ],
  },
  {
    ...commonConfig,
    outDir: "dist/tsup-unplugin",
    dts: false,

    esbuildPlugins: [
      unpluginIsolatedDecl({
        autoAddExts: true,
        extraOutdir: "oxc",
        transformer: "oxc",
      }),
    ],
  },
  {
    ...commonConfig,
    outDir: "dist/tsup-unplugin",
    dts: false,

    esbuildPlugins: [
      unpluginIsolatedDecl({
        autoAddExts: true,
        extraOutdir: "swc",
        transformer: "swc",
      }),
    ],
  },
]);

export default config;
