export const repositoryTypes = [
  "git",
  "jujutsu",
  "mercurial",
  "sapling",
  "subversion",
] as const;

export type RepositoryType = (typeof repositoryTypes)[number];
