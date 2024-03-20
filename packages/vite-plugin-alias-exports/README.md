# @altano/vite-plugin-alias-exports

This plugin configures Vite to resolve your package.json exports so that you can import files using your package name.

Vite (and Vitest) do not follow the Node.js module resolution algorithm perfectly. One of its differences is that Vite will not resolve exports from the package.json file for the current package, which means you can't self-reference the current package in your imports. This plugin adds `resolve.alias` entries to the Vite config to make it so that it behaves more as Node.js is specified with regards to the `exports`.
