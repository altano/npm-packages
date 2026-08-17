import path from "node:path";
import { afterEach, describe, expect, vi } from "vitest";
import { getDisposableDirectory } from "@altano/disposable-directory";
import { findRoot, findRootSync } from "../../src";
import { createExecForDirectory } from "../../src/repositoryCommand";
import { createSecondaryWorkingCopy } from "../utils/createSecondaryWorkingCopy";
import { testWithRepository } from "./context-fixtures/testWithRepository";

/**
 * https://github.com/altano/npm-packages/issues/299
 *
 * findRoot[Sync] resolves the repository (or worktree) root that physically
 * contains the given directory. It has to do that even when git environment
 * variables are hanging around in the environment, as they are for anything
 * git runs from a hook.
 *
 * From git(1) on --git-dir/GIT_DIR:
 *
 *   "Specifying the location of the .git directory using this option (or
 *    GIT_DIR environment variable) turns off the repository discovery that
 *    tries to find a directory with .git subdirectory ..., and tells Git that
 *    you are at the top level of the working tree."
 */
describe("finding a root with git environment variables set (issue #299)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  function getDeepSubdirectory(directory: string): string {
    return path.join(directory, "subdirectory", "nested", "even", "more");
  }

  testWithRepository(
    "should return the root dir given a subdirectory and an absolute GIT_DIR",
    async ({ repository }) => {
      const { directory } = await repository({ type: "git" });

      vi.stubEnv("GIT_DIR", path.join(directory, ".git"));

      expect(findRootSync(getDeepSubdirectory(directory))).toBePath(directory);
      await expect(findRoot(getDeepSubdirectory(directory))).resolves.toBePath(
        directory,
      );
    },
  );

  testWithRepository(
    "should return the root dir given a subdirectory and a GIT_WORK_TREE pointing elsewhere",
    async ({ repository }) => {
      const { directory } = await repository({ type: "git" });

      vi.stubEnv("GIT_WORK_TREE", path.join(directory, "subdirectory"));

      expect(findRootSync(getDeepSubdirectory(directory))).toBePath(directory);
      await expect(findRoot(getDeepSubdirectory(directory))).resolves.toBePath(
        directory,
      );
    },
  );

  testWithRepository(
    "should return the worktree root given a subdirectory of a linked worktree and an absolute GIT_DIR",
    async ({ repository }) => {
      const { directory } = await repository({ type: "git" });

      // A linked worktree, checked out into its own directory.
      await using worktreeParent =
        await getDisposableDirectory("test-worktree-");
      const worktree = path.join(worktreeParent.path, "linked-worktree");
      await createExecForDirectory(directory)("git", [
        "worktree",
        "add",
        "--quiet",
        "--detach",
        worktree,
      ]);

      // A linked worktree's git dir is <main>/.git/worktrees/<name>. Because
      // it's outside the worktree, git exports it as an absolute path when it
      // runs a hook, which is what makes this the reliable repro.
      const worktreeGitDirectory = await createExecForDirectory(worktree)(
        "git",
        ["rev-parse", "--absolute-git-dir"],
      );
      vi.stubEnv("GIT_DIR", worktreeGitDirectory);

      expect(findRootSync(getDeepSubdirectory(worktree))).toBePath(worktree);
      await expect(findRoot(getDeepSubdirectory(worktree))).resolves.toBePath(
        worktree,
      );
    },
  );

  testWithRepository(
    "should return the workspace root given a subdirectory of a jj workspace and an absolute GIT_DIR",
    async ({ repository }) => {
      const { directory } = await repository({ type: "jujutsu" });

      // A jj workspace is the jj counterpart of a linked worktree, and holds
      // nothing but a .jj.
      await using workspaceParent =
        await getDisposableDirectory("test-workspace-");
      const workspace = path.join(workspaceParent.path, "secondary-workspace");
      await createSecondaryWorkingCopy("jujutsu", directory, workspace);

      // Git has no claim on a directory like that -- unless it inherits
      // GIT_DIR, which turns discovery off and makes it call whatever
      // directory it was run in the top level. Pointed at an unrelated
      // repository, which is the shape of what a hook exports, git answers for
      // the jj subdirectory itself and does it before jj is ever asked.
      await using unrelatedRepository = await getDisposableDirectory(
        "test-unrelated-git-repository-",
      );
      await createExecForDirectory(unrelatedRepository.path)("git", [
        "init",
        "--quiet",
      ]);
      vi.stubEnv("GIT_DIR", path.join(unrelatedRepository.path, ".git"));

      expect(findRootSync(getDeepSubdirectory(workspace))).toBePath(workspace);
      await expect(findRoot(getDeepSubdirectory(workspace))).resolves.toBePath(
        workspace,
      );
    },
  );
});
