import { expect } from "vitest";

import toBePath from "./toBePath.js";
import toBeFile from "./toBeFile.js";
import toBeDirectory from "./toBeDirectory.js";
import toEqualFile from "./toEqualFile.js";
import toMatchError from "./toMatchError.js";
import toThrowErrorMatching from "./toThrowErrorMatching.js";

expect.extend({
  toBePath,
  toBeFile,
  toBeDirectory,
  toEqualFile,
  toMatchError,
  toThrowErrorMatching,
});
