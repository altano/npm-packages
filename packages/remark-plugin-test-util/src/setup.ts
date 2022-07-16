import prettier from "prettier";
import prettierConfig from "../../../.prettierrc.json";
import { VFile } from "vfile";
import { expect } from "vitest";

import type { Options } from "prettier";

type Serializer = Parameters<typeof expect.addSnapshotSerializer>[0];

const VFileSerializer: Serializer = {
  serialize(val: VFile, _config, _indentation, _depth, _refs, _printer) {
    const contents = val.toString();
    const output = prettier.format(contents, {
      parser: "babel",
      ...(prettierConfig as Options),
    });
    return output;
  },
  test(val) {
    return val instanceof VFile;
  },
};

expect.addSnapshotSerializer(VFileSerializer);
