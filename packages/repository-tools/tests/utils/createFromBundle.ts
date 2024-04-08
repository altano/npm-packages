import { createExecForDirectory } from "../../src/repositoryCommand";
import type { RepositoryType } from "../../src/types";
import { getDisposableDirectory } from "./getDisposableDirectory";
import { getBundlePath } from "./globalSetup";
import { unreachableCase } from "ts-assert-unreachable";

export async function createFromBundle(
  type: RepositoryType,
  templateDirectory: string,
  destinationDirectory: string,
): Promise<void> {
  const exec = createExecForDirectory(destinationDirectory);
  switch (type) {
    case "git":
      await exec(`git`, ["clone", "--quiet", getBundlePath("git"), "."]);
      break;
    case "sapling":
      {
        // We can go from git bundle => git repo => sl clone. It's about 2.5x
        // faster than creating the sl repo from scratch.
        await using temporaryGitClone = await getDisposableDirectory(
          "repository-temp-git-clone-",
        );
        await createFromBundle(
          "git",
          templateDirectory,
          temporaryGitClone.path,
        );
        await exec(`sl`, [
          "clone",
          "--quiet",
          `git+file://${temporaryGitClone.path}`,
          destinationDirectory,
        ]);
      }
      break;
    case "mercurial":
      await exec(`hg`, ["clone", "--quiet", getBundlePath("mercurial"), "."]);
      break;
    case "subversion":
      {
        await using temporarySvnClone = await getDisposableDirectory(
          "repository-temp-svn-clone-",
        );

        await exec(`svnadmin`, ["create", temporarySvnClone.path]);
        await exec(`svnadmin`, [
          "load",
          "--file",
          getBundlePath("subversion"),
          temporarySvnClone.path,
          // `file://${temporarySvnClone.path}`,
        ]);
        await exec(`svn`, [
          "--quiet",
          "checkout",
          `file://${temporarySvnClone.path}`,
          ".",
        ]);
      }
      break;
    default:
      unreachableCase(type);
  }
}
