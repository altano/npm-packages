# alan's npm package monorepo

[![npm Badge](https://img.shields.io/badge/npm-gray?logo=npm)](https://www.npmjs.com/~altano?activeTab=packages)
[![GitHub test action status](https://github.com/altano/npm-packages/actions/workflows/test.yml/badge.svg)](https://github.com/altano/npm-packages/actions/workflows/test.yml) [![GitHub commit activity](https://img.shields.io/github/commit-activity/y/altano/npm-packages)](https://github.com/altano/npm-packages/commits)

## Development Environment

[![Built with Devbox](https://jetpack.io/img/devbox/shield_galaxy.svg)](https://jetpack.io/devbox/docs/contributor-quickstart/)

This repository has a `devbox.json` which means you can trivially create a development environment for it. That environment is also used in GitHub action workflows.

Read the [Devbox quickstart](https://jetpack.io/devbox/docs/contributor-quickstart/) or read more about why Devbox is fantastic [on my website](https://alan.norbauer.com/articles/devbox-intro).

## Contributing

I don't expect any contributions to this repository but I will accept pull requests.

When submitting a pull request that should result in a version bump of a package, please include a changeset (run `pnpm changeset` before pushing).

## Publishing Packages Process

When creating a Pull Request, add a changeset with:

```bash
pnpm changeset
```
