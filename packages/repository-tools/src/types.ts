export const repositoryTypes = [
  "git",
  "mercurial",
  "sapling",
  "subversion",
] as const;

export type RepositoryType = (typeof repositoryTypes)[number];
