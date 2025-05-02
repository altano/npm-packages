# astro-prettier-response

This package injects a middleware that runs the [Prettier formatter](https://prettier.io) for all output to make it unminified and pretty ✨. If it can't format something, it returns it as-is.

## Wait, what?

This defies standard convention: instead producing minified output that is _as small as possible_, this makes your output _as pretty as possible_. You probably don't want to use this integration, and if you think you do, you almost certainly only want to use it on your statically-generated content.

See [https://alan.norbauer.com/articles/dying-for-beauty/](https://alan.norbauer.com/articles/dying-for-beauty/) for a write-up of why I made this.

# Prerequisites

This integration is for [Astro](https://astro.build). If you aren't using Astro you're in the wrong place.

# Installation

## Astro Integration Installer

In your existing Astro project:

```sh
# Using NPM
npx astro add @altano/astro-prettier-response
# Using Yarn
yarn astro add @altano/astro-prettier-response
# Using PNPM
pnpm astro add @altano/astro-prettier-response
```

## Manual Installation

Install the package:

```sh
# Using NPM
npx install @altano/astro-prettier-response
# Using Yarn
yarn add @altano/astro-prettier-response
# Using PNPM
pnpm add @altano/astro-prettier-response
```

Add it to your Astro config:

```js
import prettierResponse from "@altano/astro-prettier-response";

export default defineConfig({
  integrations: [prettierResponse()],
});
```

## Configuration Options

The integration works fine with no manual configuration, but here are the options and their default values:

```js
import prettierResponse from "@altano/astro-prettier-response";

export default defineConfig({
  integrations: [
    prettierResponse({
      disableMinifiers: true, // disable Astro's html/css/js minifiers
      formatXml: false, // requires the `@prettier/plugin-xml` package be installed
    }),
  ],
});
```

## Whitespace Sensitivity

Prettier is sensitive to significant whitespace in its formatting. This integration leaves the default `--html-whitespace-sensitivity=css` in place. If you run into trouble you can override this default setting on a case-by-case basis right in your html and it will be respected by Prettier. See https://prettier.io/blog/2018/11/07/1.15.0.html#whitespace-sensitive-formatting for more information about html whitespace handling and https://github.com/prettier/plugin-xml?tab=readme-ov-file#whitespace for xml whitespace handling.

## Config Overrides

You might have noticed this line in your Astro logs:

> [astro-prettier-response] Disabling minification of html/css/js in Astro config

This is warning you that this integration is overriding your config to disable Astro's html/js/css minification, because that's obviously what you want.

If it's _not_ what you want, and you want Pretty-but-minified output for some reason, you can configure the integration to respect your Astro settings without overriding them:

```js
import prettierResponse from "@altano/astro-prettier-response";

export default defineConfig({
  integrations: [
    prettierResponse({
      // Leave Astro's minifiers on (sorry for the double-negative it is what it is)
      // ⚠️ NOT RECOMMENDED
      disableMinifiers: false,
    }),
  ],
});
```

And if you like the behavior but you just hate seeing this logged every time you build, then configure Astro to disable minification yourself and the integration will stop logging:

```js
import prettierResponse from "@altano/astro-prettier-response";

export default defineConfig({
  integrations: [prettierResponse()],
  vite: {
    build: {
      minify: false,
      cssMinify: false,
    },
  },
  compressHTML: false,
});
```

This will leave minification enabled but will still run your output through Prettier.

## How This Integration Works

This integration injects a middleware that intercepts all requests. It looks at the `Content-Type` of every `Response` and determines the extension (using the `mime-types` npm package). This is passed along to Prettier which uses it to determine the appropriate parser to use, and then it attempts formatting.

If your Response doesn't have a `Content-Type`, it won't be formatted, so make sure you return one in the headers of your endpoints.

Formatting is only attempted if the `Response.status` is 2xx or 4xx (so a 500 error, for example, will pass through the middleware untouched).

## Troubleshooting

If you are getting back unformatted content and you don't know why:

- If it's an endpoint, make sure you return a `Content-Type` header (.astro files have this set automatically).
- If it's an xml file, make sure you've enabled the `formatXml` option and installed the `@prettier/plugin-xml` package.
- Try enabling Astro's verbose logging to get more log output from this integration, e.g. `astro build --verbose`, which would give you output about whether each resource was successfully formatted or not:
  ![snippet from the build logs of running the `astro build --verbose` command](./readme/verbose-logs.png)

If you are getting back formatted content, but it doesn't look like what you would expect, consult [the section above on whitespace sensitivity](#whitespace-sensitivity).

## Special Thanks

Thank you to [the Astro team](https://github.com/withastro/astro/graphs/contributors) for creating such a great site generator, especially [Fryuni](https://fryuni.dev/) for creating [Inox Tools](https://inox-tools.fryuni.dev/) which power all my Astro integrations, including this one. It makes them easier to write and possible to test and I'm not sure I'd want to make Astro integrations without them.
