import { expect } from "vitest";

import toBePath from "./toBePath.js";
import toBeFile from "./toBeFile.js";
import toBeDirectory from "./toBeDirectory.js";
import toEqualFile from "./toEqualFile.js";
import toMatchError from "./toMatchError.js";
import toThrowErrorMatching from "./toThrowErrorMatching.js";
import toHaveExifProperty from "./toHaveExifProperty.js";

expect.extend({
  toBeDirectory,
  toBeFile,
  toBePath,
  toEqualFile,
  toHaveExifProperty,
  toMatchError,
  toThrowErrorMatching,
});
