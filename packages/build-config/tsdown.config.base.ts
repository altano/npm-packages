import type { UserConfig } from "tsdown";

const config: UserConfig = {
  cwd: process.cwd(),
  fixedExtension: false,
  dts: true,
  clean: true,
  // Prevent rolldown from mangling export names in shared .d.ts chunks
  // (e.g. astro-opengraph's types chunk exports would become single letters)
  outputOptions: {
    minifyInternalExports: false,
  },
};

export default config;
