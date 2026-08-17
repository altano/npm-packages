---
"@altano/repository-tools": minor
---

feat: support jujutsu (jj) repositories in `findRoot` and `findRootSync`

Colocated jj repos were already found by way of their `.git`. This adds a `jj`
check, so non-colocated repos and `jj workspace` working copies (ones with only
`.jj` and not `.git` directory) are found too.
