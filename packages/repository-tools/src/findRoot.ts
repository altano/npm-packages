import { repositoryExec } from "./repositoryCommand";

async function findGitRoot(directory: string): Promise<string> {
  return repositoryExec(directory, "git", [
    "rev-parse",
    "--quiet",
    "--show-toplevel",
  ]);
}

async function findSaplingRoot(directory: string): Promise<string> {
  return repositoryExec(directory, "sl", ["--quiet", "root"]);
}

async function findMercurialRoot(directory: string): Promise<string> {
  return repositoryExec(directory, "hg", ["--quiet", "root"]);
}

async function findSubversionRoot(directory: string): Promise<string> {
  return repositoryExec(directory, "svn", ["info", "--show-item", "wc-root"]);
}

// Version control systems to check for. Highest-precedence checks go first.
const findMethods = [
  findGitRoot, // most used and fastest check
  findSubversionRoot, // next highest market share
  findSaplingRoot, // much smaller market share, but much faster
  findMercurialRoot, // slow af
] as const;

/**
 * Find the root path of the repository containing the given directory.
 *
 * @returns null if not found or the path of the repository root as a string
 */
export async function findRoot(
  /**
   * The directory path of anything in a version-controlled repository
   */
  directory: string,
): Promise<string | null> {
  for (const method of findMethods) {
    try {
      const result = await method(directory);
      if (result != null && result !== "") {
        return result;
      }
    } catch (e: unknown) {
      if (e instanceof Error && "code" in e && e.code === "ENOTDIR") {
        // rethrow error when given directory path isn't a directory
        throw new Error(`Given path isn't a directory: ${directory}`);
      }
    }
  }
  return null;
}
