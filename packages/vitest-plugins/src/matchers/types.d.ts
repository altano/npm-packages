// Have to import these to get declaration merging.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Assertion, AsymmetricMatchersContaining } from "vitest";

interface CustomMatchers<R = unknown> {
  toMatchError(expected: unknown): R;
  toThrowErrorMatching(expected: unknown): R;
}

declare module "vitest" {
  interface Assertion<T> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
