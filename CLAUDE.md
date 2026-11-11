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

## Running tools

Run anything that needs the dev tools (tests, e2e, `pnpm prep`) inside the flake's
devshell: `nix develop --command bash -c '...'`. Outside it, `tree` and `hg` are
missing and `PLAYWRIGHT_BROWSERS_PATH` points at a stale store path, so e2e fails
with "Executable doesn't exist".

turbo runs in strict env mode: a task only sees the environment variables that
`turbo.json` declares in `globalEnv`, or in the task's `env` or `passThroughEnv`.
A variable the devshell exports therefore reaches a `nix develop --command` step
but not the turbo task it runs. For example, Linux WebKit aborts with "Could not
create EGL display" in CI unless `test:e2e` passes through the Mesa variables
that `llvmpipeHook` sets (see `flake.nix`).

## Dependency age gate

`pnpm-workspace.yaml` sets `minimumReleaseAge: 10080` (7 days). To land a version
before it matures, add it to `minimumReleaseAgeExclude` (for example
`satori@0.29.0`; join several versions with `||`) instead of lowering the gate.
Keep `minimumReleaseAge` set explicitly: it turns on strict mode, which prompts and
aborts on an immature pick. Without it pnpm silently appends the pick to the
exclude list. `pnpm run check:dependency-resolution` re-resolves from scratch and
catches violations.

## Stale pnpm state

- `rm pnpm-lock.yaml && pnpm install` does not purge an orphaned lockfile entry:
  pnpm restores it from `node_modules/.pnpm/lock.yaml`. To purge, either
  `rm -rf node_modules pnpm-lock.yaml` and reinstall (this re-resolves every `^`
  range), or edit the entry out of `pnpm-lock.yaml` by hand and run `pnpm install`.
  To test whether a package is really required, copy only the manifests into an
  empty directory and run `pnpm install --lockfile-only`.
- After a reverted dependency upgrade, run
  `rm -rf node_modules packages/*/node_modules examples/*/node_modules` and
  `pnpm install --frozen-lockfile`. Orphaned `.bin` shims in
  `packages/*/node_modules/.bin/` survive `--force` and shadow the lockfile's
  version of a tool. A package that runs a tool without declaring it as a
  devDependency is the one an orphan can shadow, so declare it (`"prettier":
"catalog:"`).

## Deferred upgrades

- **typescript 7**: on 2026-11-10, `typescript-eslint` 8.72.1 still capped its
  `typescript` peer at `<6.1.0`, and `@astrojs/check` 0.9.12 at `^5.0.0 || ^6.0.0`.
