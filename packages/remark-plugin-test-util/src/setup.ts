import prettier from "prettier";
import prettierConfig from "../../../.prettierrc.json";
import { VFile } from "vfile";
import { expect } from "vitest";

import type { Options } from "prettier";

type Serializer = Parameters<typeof expect.addSnapshotSerializer>[0];

const VFileSerializer: Serializer = {
  serialize(val: VFile, _config, _indentation, _depth, _refs, _printer) {
    const contents = val.toString();
    const formatted = prettier.format(contents, {
      parser: "babel",
      ...(prettierConfig as Options),
    });

    // Strip absolute paths from the output to make tests portable
    const sourceDir = process.env["npm_config_local_prefix"];
    if (sourceDir == null) {
      throw new Error(`npm_config_local_prefix env variable must be set`);
    }
    return formatted.replaceAll(sourceDir, "<repo-root>");
  },
  test(val) {
    return val instanceof VFile;
  },
};

expect.addSnapshotSerializer(VFileSerializer);
