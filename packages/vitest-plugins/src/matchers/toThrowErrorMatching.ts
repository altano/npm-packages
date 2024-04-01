import toMatchError from "./toMatchError";
import type { Matcher } from "./matcher";

const toThrowErrorMatching: Matcher = function (
  received: () => never,
  expected: unknown,
) {
  let error: unknown = null;
  try {
    received();
  } catch (e: unknown) {
    error = e;
  }
  if (error instanceof Error) {
    return toMatchError.call(this, error, expected);
  } else {
    return {
      message: () => `Did not throw an Error`,
      pass: false,
      actual: error,
      expected: `[Error]`,
    };
  }
};

export default toThrowErrorMatching;
