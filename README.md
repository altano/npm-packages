# alan's npm package monorepo

Published to [npm](https://www.npmjs.com/~altano)

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
