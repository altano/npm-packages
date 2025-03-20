import { expect } from "vitest";

import absolutePathSerializer from "./absolutePath.js";
expect.addSnapshotSerializer(absolutePathSerializer);

import localHostnameSerializer from "./url.js";
expect.addSnapshotSerializer(localHostnameSerializer);

import vFileSerializer from "./vFile.js";
expect.addSnapshotSerializer(vFileSerializer);

import htmlSerializer from "./html.js";
expect.addSnapshotSerializer(htmlSerializer);
