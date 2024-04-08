import { expect } from "vitest";

import toBePath from "./toBePath";
import toBeFile from "./toBeFile";
import toBeDirectory from "./toBeDirectory";
import toEqualFile from "./toEqualFile";
import toMatchError from "./toMatchError";
import toThrowErrorMatching from "./toThrowErrorMatching";

expect.extend({
  toBePath,
  toBeFile,
  toBeDirectory,
  toEqualFile,
  toMatchError,
  toThrowErrorMatching,
});
