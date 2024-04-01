import { expect } from "vitest";

import toMatchError from "./toMatchError";
import toThrowErrorMatching from "./toThrowErrorMatching";

expect.extend({
  toMatchError,
  toThrowErrorMatching,
});
