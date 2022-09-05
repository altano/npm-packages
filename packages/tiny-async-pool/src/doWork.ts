import { doWorkAndYield } from "./doWorkAndYield";

/**
 * Process items from `iterable` in batches.
 */
export async function doWork<TIn, TOut, TIterable extends Iterable<TIn>>(
  ...args: Parameters<typeof doWorkAndYield<TIn, TOut, TIterable>>
): Promise<void> {
  for await (const _result of doWorkAndYield(...args)) {
    // no-op
  }
}
