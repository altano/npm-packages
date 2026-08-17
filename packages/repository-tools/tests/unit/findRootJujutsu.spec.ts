import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect } from "vitest";
import { findRoot, findRootSync } from "../../src";
import { createExecForDirectory } from "../../src/repositoryCommand";
import { testWithRepository } from "./context-fixtures/testWithRepository";

/**
 * The generic findRoot[Sync] specs cover jj alongside every other supported
 * VCS. These cover what is specific to jj:
 *
 *   1. that we answer for a repository git cannot see at all, which is the
 *      only case where the jj check does any work, and
 *   2. that asking the question leaves the repository alone.
 */
describe("finding a jujutsu root", () => {
  /**
   * Reading the repository is fine; writing to it is not. jj snapshots the
   * working copy at the start of almost every command, which appends an
   * operation to the log. `findRoot` passes `--ignore-working-copy` to keep
   * that from happening.
   */
  function getOperationLogHead(directory: string): Promise<string> {
    return createExecForDirectory(directory)("jj", [
      "--ignore-working-copy",
      "--quiet",
      "op",
      "log",
      "--no-graph",
      "--limit",
      "1",
      "-T",
      "id.short()",
    ]);
  }

  testWithRepository(
    "should find a root that git cannot see",
    async ({ repository }) => {
      const { directory } = await repository({ type: "jujutsu" });

      // The fixture clones with --no-colocate on purpose. If a .git ever
      // shows up here, findRoot's git check would answer first and every jj
      // test in this package would pass without running a single jj command.
      await expect(fs.access(path.join(directory, ".git"))).rejects.toThrow();
      expect(path.join(directory, ".jj")).toBeDirectory();

      expect(findRootSync(directory)).toBePath(directory);
      await expect(findRoot(directory)).resolves.toBePath(directory);
    },
  );

  testWithRepository(
    "should return the root dir given a deeply nested subdirectory",
    async ({ repository }) => {
      const { directory } = await repository({ type: "jujutsu" });
      const nested = path.join(directory, "subdirectory", "nested", "even");

      expect(findRootSync(nested)).toBePath(directory);
      await expect(findRoot(nested)).resolves.toBePath(directory);
    },
  );

  testWithRepository(
    "should not snapshot the working copy",
    async ({ repository }) => {
      const { directory } = await repository({ type: "jujutsu" });

      // Something for jj to snapshot, so that a snapshot would be visible.
      await fs.writeFile(path.join(directory, "uncommitted.txt"), "hello");

      const before = await getOperationLogHead(directory);
      expect(findRootSync(directory)).toBePath(directory);
      await expect(findRoot(directory)).resolves.toBePath(directory);
      expect(await getOperationLogHead(directory)).toEqual(before);

      // Control: a command that does snapshot moves the log head, so the
      // assertion above is capable of failing.
      await createExecForDirectory(directory)("jj", ["--quiet", "status"]);
      expect(await getOperationLogHead(directory)).not.toEqual(before);
    },
  );
});
