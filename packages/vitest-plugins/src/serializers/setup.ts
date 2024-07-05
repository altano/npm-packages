import { expect } from "vitest";

import absolutePathSerializer from "./absolutePath.js";
expect.addSnapshotSerializer(absolutePathSerializer);

import vFileSerializer from "./vFile.js";
expect.addSnapshotSerializer(vFileSerializer);
