import useComponent from "@altano/remark-astrojs-image-use-component";
import autoImport from "@altano/remark-astrojs-image-auto-import";

import type { Plugin } from "unified";

interface Preset {
  plugins: Plugin<[], unknown, unknown>[];
}

const preset: Preset = {
  plugins: [useComponent, autoImport],
};

export default preset;
