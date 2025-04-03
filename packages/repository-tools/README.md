# repository-tools

[![npm](https://badgen.net/npm/v/@altano/repository-tools)](https://www.npmjs.com/package/@altano/repository-tools) ![Typed with TypeScript](https://badgen.net/npm/types/@altano/repository-tools) ![ESM only](https://badgen.net/badge/module/esm%20only?icon=js)

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

NOTE: As of v1.0.0 this is an ESM-only module package. It can be imported as an ESM module from any Node.js version but if requiring this package from a CJS package, you must use Node.js v20.19.0+ or v22.12.0+. If you get a `ERR_REQUIRE_ESM` error when calling `require("@altano/repository-tools")` make sure you're on a new enough version of Node.js.

You may import all the tools, or import functions directly:

| Using sub-path exports | Import to use                                                      |
| ---------------------- | ------------------------------------------------------------------ |
| No                     | `import { findRoot } from "@altano/repository-tools";`             |
| Yes                    | `import { findRoot } from "@altano/repository-tools/findRoot.js";` |
