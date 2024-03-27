import { doWorkAndYield, type IterableItem } from "./doWorkAndYield";

/**
 * Process items from `iterable` in batches.
 */
export async function doWork<TIn, TIterable extends Iterable<TIn>>(
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
   * `iterable`. Promise returned must not resolve to a value, as it will be
   * ignored.
   */
  iteratorFn: (
    item: IterableItem<TIterable>,
    Iterable: TIterable,
  ) => Promise<void>,
): Promise<void> {
  for await (const _result of doWorkAndYield(
    concurrentCount,
    iterable,
    iteratorFn,
  )) {
    // no-op
  }
}
