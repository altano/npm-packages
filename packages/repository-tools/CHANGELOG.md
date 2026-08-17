# @altano/repository-tools

## 2.1.0

### Minor Changes

- a243a02: feat: support jujutsu (jj) repositories in `findRoot` and `findRootSync`

  Colocated jj repos were already found by way of their `.git`. This adds a `jj`
  check, so non-colocated repos and `jj workspace` working copies (ones with only
  `.jj` and not `.git` directory) are found too.

## 2.0.5

### Patch Changes

- e9055f0: fix `findRoot`/`findRootSync` returning the wrong root when git environment
  variables are inherited from the surrounding process

  Git exports `GIT_DIR` (among others) before it runs a hook, so anything a hook
  spawns inherits it. With `GIT_DIR` set and `GIT_WORK_TREE` unset, git skips
  repository discovery and treats the current directory as the top of the work
  tree, so `git rev-parse --show-toplevel` echoed back the directory it was given
  instead of the repository root containing it. Called from a hook in a linked
  worktree, `findRootSync("/repo/packages/foo")` returned `/repo/packages/foo`.

  Git commands are now run without the environment variables that pin git to one
  particular repository, work tree, index, or object store (`GIT_DIR`,
  `GIT_WORK_TREE`, `GIT_INDEX_FILE`, etc). Variables that only tune discovery and
  that you have to opt into deliberately (`GIT_CEILING_DIRECTORIES`,
  `GIT_DISCOVERY_ACROSS_FILESYSTEM`) are left alone.

  Fixes [#299](https://github.com/altano/npm-packages/issues/299).

## 2.0.4

### Patch Changes

- 1884663: replace the `find-cache-dir` dev dependency with `find-cache-directory`. `find-cache-dir@6` is deprecated in favor of the renamed package; the API is unchanged.
- 4818735: update `tsdown` to 0.22, which builds the published `dist/` output

## 2.0.3

### Patch Changes

- b04392f: externalize @altano/disposable-directory

## 2.0.2

### Patch Changes

- 72b15cc: update dependencies
- fb3c931: upgrade tsdown

## 2.0.1

### Patch Changes

- 1ab88a4: export source maps

## 2.0.0

### Major Changes

- 38c79ef: build with tsc

## 1.0.1

### Patch Changes

- c754dc5: add types to package.json

## 1.0.0

### Major Changes

- c3798f3: esm-only, remove cjs support

  Can be imported as an ESM module from any Node.js version but if requiring this package from a CJS package, you must use Node.js v20.19.0+ or v22.12.0+

## 0.1.1

### Patch Changes

- 7cf6538: fix cjs package

## 0.1.0

### Minor Changes

- e8ee7a9: publish hybrid cjs/esm package
- 8f876e2: Enable importing specific functions

## 0.0.4

### Patch Changes

- 2266961: fix import extensions for node libraries

## 0.0.3

### Patch Changes

- 7ea1103: add js extensions

## 0.0.2

### Patch Changes

- f2dda42: initial release
