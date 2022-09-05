type ExecutingPromise<TOut> = Promise<[ExecutingPromise<TOut>, TOut]>;
type IterableItem<T> = T extends Iterable<infer R> ? R : never;

/**
 * Process items from `iterable` in batches and yield the result of each call to
 * `iteratorFn`
 */
export async function* doWorkAndYield<
  TIn,
  TOut,
  TIterable extends Iterable<TIn>,
>(
  /**
   * The size of the batch of work, or, how many times `iteratorFn` will be
   * called in parallel.
   */
  concurrentCount: number,
  /**
   * An iterable that contains the items that should be passed to `iteratorFn`.
   */
  iterable: TIterable,
  /**
   * The async callback function that does the work. Will be passed items from
   * `iterable`.
   */
  iteratorFn: (
    item: IterableItem<TIterable>,
    Iterable: TIterable,
  ) => Promise<TOut>,
): AsyncGenerator<Awaited<TOut>, void, unknown> {
  const executing = new Set<ExecutingPromise<TOut>>();

  async function consume(): Promise<TOut> {
    const [promise, value] = await Promise.race(executing);
    executing.delete(promise);
    return value;
  }

  for (const item of iterable) {
    // Create a [Promise, Value] tuple so that we can access the original Promise
    // when `Promise.race(...)` resolves
    const result = iteratorFn(item as IterableItem<TIterable>, iterable);
    const promise = result.then((value): [ExecutingPromise<TOut>, TOut] => [
      promise,
      value,
    ]);
    executing.add(promise);
    if (executing.size >= concurrentCount) {
      yield await consume();
    }
  }
  while (executing.size) {
    yield await consume();
  }
}
