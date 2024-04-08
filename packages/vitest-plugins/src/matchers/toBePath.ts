import type { Matcher } from "./matcher";
import { realpathSync } from "node:fs";

function getRealpath(path: string): string | null {
  try {
    return realpathSync(path);
  } catch (_e) {
    return null;
  }
}

const toBePath: Matcher = function (received: string, expected: string) {
  const receivedRealpath = getRealpath(received);
  const expectedRealpath = getRealpath(expected);

  return {
    message: () =>
      receivedRealpath == null || expectedRealpath == null
        ? `One of the paths wasn't an accessible file on disk and couldn't be compared`
        : `The realpath of the received path did not match the expected one`,
    pass: this.equals(receivedRealpath, expectedRealpath),
    actual: receivedRealpath,
    expected: expectedRealpath,
  };
};

export default toBePath;
