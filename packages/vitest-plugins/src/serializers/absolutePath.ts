import process from "node:process";
import type { SnapshotSerializer } from "vitest";

function getCWD(): string {
  return process.cwd();
}

/**
 * Strip absolute paths from the output to make tests portable
 */
function stripAbsolutePaths(str: string): string {
  return str.replaceAll(getCWD(), "<cwd>");
}

const serializer: SnapshotSerializer = {
  serialize(val: string, config, indentation, depth, refs, printer) {
    return printer(stripAbsolutePaths(val), config, indentation, depth, refs);
  },
  test(val) {
    return (
      typeof val === "string" &&
      // This is potentially really expensive, given large strings, but I can't
      // find a better way to do this. Without this check, the string will keep
      // getting reprocessed by this serializer over and over.
      val.includes(getCWD())
    );
  },
};

export default serializer;
