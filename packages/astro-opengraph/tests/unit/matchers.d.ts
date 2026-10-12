// Have to import these to get declaration merging.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Matchers } from "vitest";
import type { MatchImageSnapshotOptions } from "jest-image-snapshot";

declare module "vitest" {
  // Type parameters must match the original declaration exactly, so the
  // unused `T` has to stay.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<R extends void | Promise<void>, T> {
    toMatchImageSnapshot(options?: MatchImageSnapshotOptions): R;
  }
}
