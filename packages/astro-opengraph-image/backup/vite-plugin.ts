import { OutputOptions, OutputBundle, Plugin } from "rollup";
import { createFilter } from "@rollup/pluginutils";

export default ({
  include = "*.html",
  exclude = undefined,
  filter = createFilter(include, exclude),
}: // options = {}
{
  include?: string | string[];
  exclude?: string | string[];
  filter?: (id: string | unknown) => boolean;
  // options?: Options
} = {}): Plugin => ({
  name: "opengraph-image-plugin",
  generateBundle(outputOptions: OutputOptions, bundle: OutputBundle) {
    Object.values(bundle).forEach((file) => {
      if (file.type !== "asset" || !filter(file.fileName)) {
        return;
      }
      console.log(`In vite plugin`);
      console.log({ fileName: file.name });
      // file.source = minify(file.source.toString(), options)
    });
  },
});
