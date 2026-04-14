# alan's npm package monorepo

[![npm Badge](https://img.shields.io/badge/npm-gray?logo=npm)](https://www.npmjs.com/~altano?activeTab=packages)
[![GitHub test action status](https://github.com/altano/npm-packages/actions/workflows/test.yml/badge.svg)](https://github.com/altano/npm-packages/actions/workflows/test.yml) [![GitHub commit activity](https://img.shields.io/github/commit-activity/y/altano/npm-packages)](https://github.com/altano/npm-packages/commits)

## Development Environment

This repository uses a [Nix flake](./flake.nix) for reproducible development environments. With [direnv](https://direnv.net/) installed, all tools are available automatically when you `cd` into the repository.

Alternatively, enter the dev shell manually:

```sh
nix develop .#local-dev
```

## Contributing

I don't expect any contributions to this repository but I will accept pull requests.

When submitting a pull request that should result in a version bump of a package, please include a changeset (run `pnpm changeset` before pushing).

## GitHub Workflows

### Publishing Packages (`release.yml`)

Handles releases via [changesets](https://changesets-docs.vercel.app). Automatically create a PR to release new versions of packages based on changesets merged into the `main` branch. Once this PR is merged, `changesets` will publish to npm.

NOTE: I have to manually close and re-open these PRs to make the required `test` GitHub workflow run.

### Testing (`test.yml`)

Runs various lint, type-checks, unit tests, e2e tests, etc. Merging pull requests requires this job to complete.

All jobs use the [`install-nix`](./.github/actions/install-nix/) composite action with a named [devShell](./flake.nix):

- `ci` — Node.js + pnpm (build, lint, format, check, release)
- `test-unit` — adds VCS tools (git, mercurial, sapling, subversion)
- `test-e2e` — adds Playwright browsers from Nix
