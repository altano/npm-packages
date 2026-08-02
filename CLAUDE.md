# npm-packages

## Package management

This is a pnpm workspace monorepo. Use `pnpm`, never `npm`/`npx`/`yarn`.

| Task                                   | Command                       |
| -------------------------------------- | ----------------------------- |
| Install everything                     | `pnpm install`                |
| Add a dependency to a package          | `pnpm add <pkg>` (in its dir) |
| Run a package script                   | `pnpm <script>`               |
| Run a locally-installed binary         | `pnpm exec <bin>`             |
| Run a one-off package that isn't a dep | `pnpm dlx <pkg>`              |

Notes:

- Shared dependency versions live in `pnpm-workspace.yaml` under `catalog:` /
  `catalogs:`.

## Version control

If the working copy has a `.jj/` directory, it's a jj clone of this git repo:
use `jj` (`jj status`, `jj log`, `jj diff`, `jj describe`, `jj new`,
`jj squash`), never `git`. Otherwise use `git`.
