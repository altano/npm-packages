import { expect } from "vitest";

import absolutePathSerializer from "./absolutePath";
expect.addSnapshotSerializer(absolutePathSerializer);

import vFileSerializer from "./vFile";
expect.addSnapshotSerializer(vFileSerializer);
