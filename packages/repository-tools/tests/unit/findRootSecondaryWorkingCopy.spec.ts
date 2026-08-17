import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect } from "vitest";
import { getDisposableDirectory } from "@altano/disposable-directory";
import { findRoot, findRootSync } from "../../src";
import {
  createSecondaryWorkingCopy,
  secondaryWorkingCopySupportingRepositoryTypes,
  type SecondaryWorkingCopySupportingRepositoryType,
} from "../utils/createSecondaryWorkingCopy";
import { testWithRepository } from "./context-fixtures/testWithRepository";

/**
 * A git worktree and a jj workspace are both a second working copy of one
 * repository, living in a directory of their own. findRoot[Sync] resolves the
 * working copy that physically contains the given directory, so it has to
 * answer with the secondary one, not with the working copy it was created
 * from.
 */
describe("finding the root of a secondary working copy", () => {
  async function createWorkingCopy(
    type: SecondaryWorkingCopySupportingRepositoryType,
    repositoryDirectory: string,
    parentDirectory: string,
  ): Promise<string> {
    // The VCS creates this directory itself.
    const workingCopy = path.join(parentDirectory, "secondary");
    await createSecondaryWorkingCopy(type, repositoryDirectory, workingCopy);
    return workingCopy;
  }

  describe.each(secondaryWorkingCopySupportingRepositoryTypes)(
    "type = %s",
    (type) => {
      testWithRepository(
        `should return the secondary working copy given its root`,
        async ({ repository }) => {
          const { directory } = await repository({ type });
          await using parent = await getDisposableDirectory(
            "test-secondary-working-copy-",
          );
          const workingCopy = await createWorkingCopy(
            type,
            directory,
            parent.path,
          );

          // A checkout with the repository's files in it, not an empty
          // directory that happens to have a root.
          expect(path.join(workingCopy, "test-file.txt")).toBeFile();

          expect(findRootSync(workingCopy)).toBePath(workingCopy);
          await expect(findRoot(workingCopy)).resolves.toBePath(workingCopy);
        },
      );

      testWithRepository(
        `should return the secondary working copy given a deeply nested subdirectory`,
        async ({ repository }) => {
          const { directory } = await repository({ type });
          await using parent = await getDisposableDirectory(
            "test-secondary-working-copy-",
          );
          const workingCopy = await createWorkingCopy(
            type,
            directory,
            parent.path,
          );
          const nested = path.join(
            workingCopy,
            "subdirectory",
            "nested",
            "even",
            "more",
          );

          expect(findRootSync(nested)).toBePath(workingCopy);
          await expect(findRoot(nested)).resolves.toBePath(workingCopy);

          // The repository it was created from is a working copy too, and the
          // wrong answer.
          expect(findRootSync(nested)).not.toBePath(directory);
        },
      );
    },
  );

  testWithRepository(
    "a jujutsu workspace should be found without git being able to see it",
    async ({ repository }) => {
      const { directory } = await repository({ type: "jujutsu" });
      await using parent = await getDisposableDirectory(
        "test-secondary-working-copy-",
      );
      const workspace = await createWorkingCopy(
        "jujutsu",
        directory,
        parent.path,
      );

      // Unlike a git worktree, which git finds through the .git file it leaves
      // behind, a jj workspace holds nothing but a .jj. That makes the jj
      // check the only one that can answer here -- and it stays true for a
      // colocated repository, whose workspaces are not themselves colocated.
      await expect(fs.access(path.join(workspace, ".git"))).rejects.toThrow();
      expect(path.join(workspace, ".jj")).toBeDirectory();

      expect(findRootSync(workspace)).toBePath(workspace);
      await expect(findRoot(workspace)).resolves.toBePath(workspace);
    },
  );
});
