import prettier from "@prettier/sync";
import prettierConfig from "../../../../.prettierrc.json";
import { VFile, type Value as VFileValue } from "vfile";
import type { Options } from "prettier";
import type { SnapshotSerializer } from "vitest";

class FormattedVFile extends VFile {
  constructor(vfile: VFile, formattedContents: VFileValue) {
    super(vfile);
    this.value = formattedContents;
  }
}

const vFileSerializer: SnapshotSerializer = {
  serialize(vfile: VFile, config, indentation, depth, refs, printer) {
    const unformattedContents = vfile.toString();
    let vFileToPrint: VFile;

    try {
      const formattedContents = prettier
        .format(unformattedContents, {
          filepath: vfile.path,
          ...(prettierConfig as Options),
        })
        .trim();
      vFileToPrint = new FormattedVFile(vfile, formattedContents);
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "UndefinedParserError") {
        // Prettier doesn't have a parser for this vfile. That's fine, pass it
        // through unformatted.
        vFileToPrint = new FormattedVFile(vfile, vfile.value);
      } else {
        // Rethrow any other errors
        throw e;
      }
    }

    return printer(vFileToPrint, config, indentation, depth, refs);
  },
  test(val: unknown) {
    return val instanceof VFile && !(val instanceof FormattedVFile);
  },
};

export default vFileSerializer;
