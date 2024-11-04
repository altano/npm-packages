# alan's npm package monorepo

[![npm Badge](https://img.shields.io/badge/npm-gray?logo=npm)](https://www.npmjs.com/~altano?activeTab=packages)
[![GitHub test action status](https://github.com/altano/npm-packages/actions/workflows/test.yml/badge.svg)](https://github.com/altano/npm-packages/actions/workflows/test.yml) [![GitHub commit activity](https://img.shields.io/github/commit-activity/y/altano/npm-packages)](https://github.com/altano/npm-packages/commits)

## Development Environment

[![Built with Devbox](https://jetpack.io/img/devbox/shield_galaxy.svg)](https://jetpack.io/devbox/docs/contributor-quickstart/)

This repository has a `devbox.json` which means you can trivially create a development environment for it. That environment is also used in GitHub action workflows.

Read the [Devbox quickstart](https://jetpack.io/devbox/docs/contributor-quickstart/) or read more about why Devbox is fantastic [on my website](https://alan.norbauer.com/articles/devbox-intro).

### Playwright

The Playwright setup in this repository is a little finicky. When updating the version:

- The version of `@playwright/test` in any package.json must be kept in sync with `playwright-driver` in `devbox.json`. Both should be precisely hard-coded (no semver ranges or `'latest'`).
- The browser's path in `devbox.lock` for `playwright-driver.browsers` must be manually changed to match the hash for the `playwright-driver` entry (for the given platform). You can get the path with `ls /nix/store | grep 'playwright' | sort -k2 -t '-'`.

## Contributing

I don't expect any contributions to this repository but I will accept pull requests.

When submitting a pull request that should result in a version bump of a package, please include a changeset (run `pnpm changeset` before pushing).

## Publishing Packages Process

A GitHub release action will automatically create a PR to release new versions of packages based on changesets merged into the `main` branch.
