# inject endpoint route

```js
/**
 * @type {() => import('astro').AstroIntegration}
 */
export default () => ({
  name: "astro-opengraph-image-endpoint",
  hooks: {
    "astro:config:setup": ({ addMiddleware }) => {
      addMiddleware({
        entrypoint: new URL("./middleware.js", import.meta.url),
        order: "pre",
      });
    },
  },
});
```
