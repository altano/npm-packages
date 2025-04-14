# alan's npm package monorepo

[![npm Badge](https://img.shields.io/badge/npm-gray?logo=npm)](https://www.npmjs.com/~altano?activeTab=packages)
[![GitHub test action status](https://github.com/altano/npm-packages/actions/workflows/test.yml/badge.svg)](https://github.com/altano/npm-packages/actions/workflows/test.yml) [![GitHub commit activity](https://img.shields.io/github/commit-activity/y/altano/npm-packages)](https://github.com/altano/npm-packages/commits)

## Development Environment

[![Built with Devbox](https://jetpack.io/img/devbox/shield_galaxy.svg)](https://jetpack.io/devbox/docs/contributor-quickstart/)

This repository has a [`devbox.json`](./devbox/configs/local-dev/devbox.json) which means you can trivially create a development environment for it. That environment is also used in GitHub action workflows.

Read the [Devbox quickstart](https://jetpack.io/devbox/docs/contributor-quickstart/) or read more about why Devbox is fantastic [on my website](https://alan.norbauer.com/articles/devbox-intro).

## Contributing

I don't expect any contributions to this repository but I will accept pull requests.

When submitting a pull request that should result in a version bump of a package, please include a changeset (run `pnpm changeset` before pushing).

## GitHub Workflows

### Publishing Packages (`release.yml`)

Handles releases via [changesets](https://changesets-docs.vercel.app). Automatically create a PR to release new versions of packages based on changesets merged into the `main` branch. Once this PR is merged, `changesets` will publish to npm.

NOTE: I have to manually close and re-open these PRs to make the required `test` GitHub workflow run.

### Testing (`test.yml`)

Runs various lint, type-checks, unit tests, e2e tests, etc. Merging pull requests requires this job to complete.

How jobs have their environment prepared:

- The `test-unit` job (since it requires _everything_ to be installed) uses the [`install-devbox`](./.github/actions/install-devbox/) GitHub composite action which uses [./devbox/configs/ci/devbox.json](./devbox/configs/ci/devbox.json).
- The `test-e2e` job (since Playwright and Devbox don't work well together) uses the [`install-tools-and-deps`](./.github/actions/install-tools-and-deps) GitHub composite action which manually installs Node.js, pnpm, Playwright, etc.
- Everything else uses the [`install-devbox-slim`](./.github/actions/install-devbox-slim/) GitHub composite action which uses [./devbox/configs/ci-slim/devbox.json](./devbox/configs/ci-slim/devbox.json).
