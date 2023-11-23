# alan's npm package monorepo

![npm Badge](https://img.shields.io/badge/npm-gray?logo=npm)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/altano/npm-packages/test.yml) ![GitHub commit activity](https://img.shields.io/github/commit-activity/y/altano/npm-packages)

## Development Environment

[![Built with Devbox](https://jetpack.io/img/devbox/shield_galaxy.svg)](https://jetpack.io/devbox/docs/contributor-quickstart/)

This repository has a `devbox.json` which means you can trivially create a development environment for it.

Read the [Devbox quickstart](https://jetpack.io/devbox/docs/contributor-quickstart/) or read more about why Devbox is fantastic [on my website](https://alan.norbauer.com/articles/devbox-intro).

## Contributing

I don't expect any contributions to this repository but I will accept pull requests.

When submitting a pull request that should result in a version bump of a package, please include a changeset (run `pnpm changeset` before pushing).

## Publishing Packages Process

When creating a PR:

```bash
pnpm changeset
```

When releasing/publishing packages:

```bash
pnpm changeset version # Review generated changes manually
pnpm changeset publish # Publishes packages to npm
git push --follow-tags # Push generated tags to github
```
