import type { RepositoryType } from "../../src/types";
import fs from "node:fs/promises";
import { getDisposableDirectory } from "./getDisposableDirectory";
import { unreachableCase } from "ts-assert-unreachable";
import { createExecForDirectory } from "../../src/repositoryCommand";

/**
 * Create a repository bundle of a given directory (that is NOT version
 * controlled). Bundle will have one commit with the given files.
 *
 * @returns true if successful, rejects if not
 */
export async function createBundle(
  /**
   * The type of repository (e.g. git/subverison/etc)
   */
  type: BundleSupportingRepositoryType,
  /**
   * The directory path of a set of files to bundle
   */
  templateDirectory: string,
  /**
   * The path of the destination bundle
   */
  destinationBundlePath: string,
): Promise<void> {
  // copy the files to a temporary directory
  await using templateDirectoryClone =
    await getDisposableDirectory("repository-clone-");
  await fs.cp(templateDirectory, templateDirectoryClone.path, {
    recursive: true,
  });

  const exec = createExecForDirectory(templateDirectoryClone.path);

  switch (type) {
    case "git": {
      // initialize the git repository
      await exec(`git`, ["init", "--quiet"]);
      await exec(`git`, ["add", "."]);
      await exec(`git`, ["reset", "--quiet", "not-committed"]);
      await exec(`git`, ["commit", "--quiet", "-m", "commit everything"]);

      // create the bundle
      await exec(`git`, [
        "bundle",
        "create",
        "--quiet",
        destinationBundlePath,
        "--all",
      ]);
      break;
    }

    case "mercurial": {
      // initialize the mercurial repository
      await exec(`hg`, ["init", "--quiet"]);
      await exec(`hg`, ["add", "--quiet", "."]);
      await exec(`hg`, ["forget", "--quiet", "not-committed"]);
      await exec(`hg`, ["commit", "--quiet", "-m", "commit everything"]);

      // create the bundle
      await exec(`hg`, ["bundle", "--quiet", "--all", destinationBundlePath]);
      break;
    }
    case "subversion": {
      await using serverDirectory = await getDisposableDirectory(
        "svn-server-repository-",
      );

      // create the server repo
      await exec(`svnadmin`, ["create", serverDirectory.path]);

      // commit template files to a temporary working copy
      await exec(`svn`, [
        "--quiet",
        "checkout",
        `file://${serverDirectory.path}`,
        ".",
      ]);
      await exec(`svn`, ["add", "--force", "."]);
      await exec(`svn`, ["rm", "--keep-local", "not-committed"]);
      await exec(`svn`, ["commit", "-m", "commit everything"]);

      // dump the repo
      await exec(`svnrdump`, [
        "dump",
        "--quiet",
        `file://${serverDirectory.path}`,
        "--file",
        destinationBundlePath,
      ]);
      break;
    }
    default:
      unreachableCase(type);
  }
}

export const bundleSupportingRepositoryTypes = [
  // git and mercurial support creating and directly cloning bundles.
  "git",
  "mercurial",

  // Subversion supports bundles but they still have to be loaded into a server
  // repository before a working copy can be generated.
  "subversion",

  // Sapling's bundle + clone functionality isn't fully implemented:
  // https://discord.com/channels/1042527964224557107/1042527965256364157/1225467868532179085
  //
  // "We changed bundle and unbundle to call git bundle so you can use the
  // resulting bundle in git repos managed by git cli but haven't changed clone.
  // clone still expects the hg-style bundle."
  //
  // "sapling"
] as const;

bundleSupportingRepositoryTypes satisfies readonly RepositoryType[];

export type BundleSupportingRepositoryType =
  (typeof bundleSupportingRepositoryTypes)[number];
