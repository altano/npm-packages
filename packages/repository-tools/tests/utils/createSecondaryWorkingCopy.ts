import type { RepositoryType } from "../../src/types";
import { createExecForDirectory } from "../../src/repositoryCommand";
import { unreachableCase } from "ts-assert-unreachable";

/**
 * The repository types that can check out a second working copy of one
 * repository into a directory of its own: a git worktree, or a jj workspace.
 *
 * findRoot has to answer with the working copy that physically contains the
 * given directory, not with the repository directory it was created from.
 *
 * Subversion isn't here: its working copies are independent checkouts of a
 * server repository rather than extra working copies of a local one. Mercurial
 * and sapling both put this behind an extension that has to be enabled in a
 * config file, and these fixtures deliberately run without one (HGRCPATH is
 * /dev/null).
 */
export const secondaryWorkingCopySupportingRepositoryTypes = [
  "git",
  "jujutsu",
] as const;

secondaryWorkingCopySupportingRepositoryTypes satisfies readonly RepositoryType[];

export type SecondaryWorkingCopySupportingRepositoryType =
  (typeof secondaryWorkingCopySupportingRepositoryTypes)[number];

/**
 * Check out a second working copy of an existing repository. The destination
 * is created by the VCS and must not already exist.
 */
export async function createSecondaryWorkingCopy(
  type: SecondaryWorkingCopySupportingRepositoryType,
  /**
   * The directory path of the repository's existing working copy
   */
  repositoryDirectory: string,
  /**
   * Where to put the new working copy
   */
  destinationDirectory: string,
): Promise<void> {
  const exec = createExecForDirectory(repositoryDirectory);

  switch (type) {
    case "git":
      // --detach because the branch is already checked out in the working copy
      // we're running from, and git refuses to check it out twice.
      await exec(`git`, [
        "worktree",
        "add",
        "--quiet",
        "--detach",
        destinationDirectory,
      ]);
      break;

    case "jujutsu":
      // With no -r, the new workspace's working-copy commit gets the same
      // parent as the current one. In a fresh clone that parent is the cloned
      // head, so the new workspace has the same files as the old one.
      await exec(`jj`, ["--quiet", "workspace", "add", destinationDirectory]);
      break;

    default:
      unreachableCase(type);
  }
}
