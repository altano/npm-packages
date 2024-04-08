# repository-tools

Misc tools for dealing with repositories of multiple version control systems

## Supported Version Control Systems

- git
- mercurial
- sapling
- subversion

## Tools

### findRoot[Sync]

Given a path inside a repository, find the path of the root

Example:

```ts
findRootSync("/my-git-repo/some/subdirectory"); // => "/my-git-repo"
```

Example:

```ts
await findRoot("/my-git-repo/some/subdirectory"); // => "/my-git-repo"
```
