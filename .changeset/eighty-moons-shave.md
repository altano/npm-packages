---
"@altano/repository-tools": patch
---

fix `findRoot`/`findRootSync` returning the wrong root when git environment
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
