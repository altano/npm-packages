import { serializeError } from "serialize-error";
import type { Matcher } from "./matcher";

const toMatchError: Matcher = function (received: Error, expected: unknown) {
  // If we don't serialize the error before passing it to vitest, vitest will
  // output just the error message (e.g. `"[Error: face]"`). If we let people
  // match against the other Error fields (e.g. `stack`) we should display those
  // instead of simplifying them out of the output.
  const serializedError = serializeError(received);
  return {
    message: () => `Expected errors to match`,
    pass: this.equals(received, expected, this.customTesters),
    actual: serializedError,
    expected: expected,
  };
};

export default toMatchError;
