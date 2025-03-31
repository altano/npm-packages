import { expect } from "vitest";

import toBePath from "./toBePath.js";
import toBeFile from "./toBeFile.js";
import toBeDirectory from "./toBeDirectory.js";
import toEqualFile from "./toEqualFile.js";
import toMatchError from "./toMatchError.js";
import toThrowErrorMatching from "./toThrowErrorMatching.js";
import toHaveExifProperty from "./toHaveExifProperty.js";
import toHaveHeader from "./response/toHaveHeader.js";
import toHaveStatus from "./response/toHaveStatus.js";

expect.extend({
  toBeDirectory,
  toBeFile,
  toBePath,
  toEqualFile,
  toHaveExifProperty,
  toMatchError,
  toThrowErrorMatching,

  // Response matchers
  toHaveHeader,
  toHaveStatus,
});
