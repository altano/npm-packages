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

## Importing

This is a dual ESM/CJS package, and publishes both a top-level module with all exports, and sub-path exports. So feel free to import using any of the following:

| Your package type | Using sub-path exports | Import to use                                                           |
| ----------------- | ---------------------- | ----------------------------------------------------------------------- |
| ESM               | No                     | `import { findRoot } from "@altano/repository-tools";`                  |
| ESM               | Yes                    | `import { findRoot } from "@altano/repository-tools/findRoot.js";`      |
| CJS               | No                     | `const { findRoot } = require("@altano/repository-tools")`              |
| CJS               | Yes                    | `const { findRoot } = require("@altano/repository-tools/findSync.cjs")` |

## Contributing

This is a dual ESM/CJS package which is really hard to get right. Manually run `pnpm build && pnpm dlx @arethetypeswrong/cli --pack` before making any changes that would affect the build, packaging, or publishing.
