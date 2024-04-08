import { repositoryExecSync } from "./repositoryCommand";

function findGitRoot(cwd: string): string {
  return repositoryExecSync(cwd, "git", [
    "rev-parse",
    "--quiet",
    "--show-toplevel",
  ]);
}

function findSaplingRoot(cwd: string): string {
  return repositoryExecSync(cwd, "sl", ["--quiet", "root"]);
}

function findMercurialRoot(cwd: string): string {
  return repositoryExecSync(cwd, "hg", ["--quiet", "root"]);
}

function findSubversionRoot(cwd: string): string {
  return repositoryExecSync(cwd, "svn", ["info", "--show-item", "wc-root"]);
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
export function findRootSync(
  /**
   * The directory path of anything in a version-controlled repository
   */
  directory: string,
): string | null {
  for (const method of findMethods) {
    try {
      const result = method(directory);
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
