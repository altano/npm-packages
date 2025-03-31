// Have to import these to get declaration merging.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Assertion, AsymmetricMatchersContaining } from "vitest";

interface CustomMatchers<R = unknown> {
  /**
   * Verify the realpath (canonical path) of expected. More lenient than a
   * string check when dealing with logical paths, symlinks, etc.
   */
  toBePath(expected: string): R;
  /** Verify a file exists (on the filesystem) */
  toBeFile(): R;
  /** Verify a directory exists (on the filesystem) */
  toBeDirectory(): R;
  /** Verify that the contents of a file at a given path match the contents of a file at a another path */
  toEqualFile(pathOfFileWithExpectedContents: string): R;
  /**
   * Similar to the `toHaveProperty` matcher, but checks exif properties on the
   * given buffer (or any object parseable by the `exifr` library).
   */
  toHaveExifProperty(property: string, value?: string | number): Promise<R>;
  /**
   * Verify any part of an error object (e.g. the stack):
   *
   * @example
   * expect(new Error("face")).toMatchError(
   *   expect.objectContaining({
   *     stack: expect.stringContaining("readme.spec.ts"),
   *   }),
   * );
   */
  toMatchError(expected: unknown): R;
  /**
   * Verify any part of a _thrown_ error object (e.g. the stack):
   *
   * @example
   * expect(() => {
   *   throw new Error("face");
   * }).toThrowErrorMatching(
   *   expect.objectContaining({
   *     stack: expect.stringContaining("readme.spec.ts"),
   *   }),
   * );
   */
  toThrowErrorMatching(expected: unknown): R;
}

interface ResponseMatchers<R = unknown> {
  /** Verify that Response has an expected header and optional value */
  toHaveHeader(header: string, value?: string | number): R;
  /** Verify that a Response has an expected status code */
  toHaveStatus(expectedStatus: number): R;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module "vitest" {
  interface Assertion<T> extends CustomMatchers<T> {}
  interface Assertion<T> extends ResponseMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
