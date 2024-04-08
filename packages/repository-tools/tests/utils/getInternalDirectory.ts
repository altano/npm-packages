import { RepositoryType } from "./../../src/types";

export function getInternalDirectory(type: RepositoryType): string {
  switch (type) {
    case "git":
      return ".git";
    case "mercurial":
      return ".hg";
    case "sapling":
      return ".sl";
    case "subversion":
      return ".svn";
  }
}
