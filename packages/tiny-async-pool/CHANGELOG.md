# @altano/tiny-async-pool

## 2.0.0

### Major Changes

- c1d2397: Stricter API: doWork's iteratorFn must return Promise<void>

  If you have an iteratorFn that resolves to a non-void value and you still want to use it, you have to be explicit by wrapping it:

  ```js
  const resolvesToValue = async function () { /* ... */ };
  await doWork(..., async () => { await resolvesToValue(); });
  ```

## 1.0.3

### Patch Changes

- 5fc1078: update dependencies
