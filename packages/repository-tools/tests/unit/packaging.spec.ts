import path from "node:path";
import { describe, expect, it } from "vitest";
import { findRoot } from "@altano/repository-tools/findRoot.js";
import { findRootSync } from "@altano/repository-tools/findRootSync.js";

// Test sub-path exports separately by importing using the package name. This
// has to be separate from other tests because vitest test coverage analysis
// doesn't understand what code this is testing.

describe("sub-path exports", function () {
  it("find this repository's root asynchronously", async () => {
    const repoRoot = path.resolve(import.meta.dirname, "..", "..", "..", "..");
    expect(await findRoot(import.meta.dirname)).toEqual(repoRoot);
  });
  it("find this repository's root synchronously", () => {
    const repoRoot = path.resolve(import.meta.dirname, "..", "..", "..", "..");
    expect(findRootSync(import.meta.dirname)).toEqual(repoRoot);
  });
});
