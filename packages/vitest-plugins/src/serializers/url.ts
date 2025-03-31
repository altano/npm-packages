import type { SnapshotSerializer } from "vitest";

const localhostPattern = /(https?:\/\/localhost):[0-9]+/gi;

/**
 * Strip the (potentially random) port from the URL
 */
function stripPort(str: string): string {
  return str.replaceAll(localhostPattern, "$1");
}

const urlSerializer: SnapshotSerializer = {
  serialize(val: string, config, indentation, depth, refs, printer) {
    return printer(stripPort(val), config, indentation, depth, refs);
  },
  test(val) {
    return typeof val === "string" && localhostPattern.test(val);
  },
};

export default urlSerializer;
