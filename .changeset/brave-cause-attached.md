---
"@altano/repository-tools": patch
---

fix: `findRoot` and `findRootSync` now attach the original error as `cause` when rejecting a path that isn't a directory
