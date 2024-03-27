import { describe, expect, it, vi } from "vitest";
import { doWork } from "../../src";

const timeout = (i: number): Promise<void> =>
  new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, i),
  );

describe("doWork", function () {
  it("only runs as many promises in parallel as given by the pool limit", async function () {
    const timeoutSpy = vi.fn(timeout);
    const items = [10, 50, 30, 20];
    await doWork(2, items, timeoutSpy);

    expect(timeoutSpy).toHaveBeenCalledTimes(4);
    expect(timeoutSpy).toHaveBeenCalledWith(10, items);
    expect(timeoutSpy).toHaveBeenCalledWith(50, items);
    expect(timeoutSpy).toHaveBeenCalledWith(30, items);
    expect(timeoutSpy).toHaveBeenCalledWith(20, items);
  });

  it("rejects on error (but does not leave unhandled rejections) (1/2)", async function () {
    const timeout = (): Promise<never> => Promise.reject();
    await expect(doWork(5, [10, 50, 30, 20], timeout)).rejects.toBeUndefined();
  });

  it("rejects on error (but does not leave unhandled rejections) (2/2)", async function () {
    const iteratorFn = (i: number, a: number[]): Promise<void> =>
      i < a.length - 1 ? Promise.resolve() : Promise.reject();
    const iteratorFnSpy = vi.fn(iteratorFn);
    const items = [0, 1, 2];

    // Rejects with 'undefined'
    await expect(doWork(2, items, iteratorFnSpy)).rejects.toBeUndefined();

    expect(iteratorFnSpy).toHaveBeenCalledTimes(3);
    expect(iteratorFnSpy).toHaveBeenCalledWith(0, items);
    expect(iteratorFnSpy).toHaveBeenCalledWith(1, items);
    expect(iteratorFnSpy).toHaveBeenCalledWith(2, items);
  });

  it("should be a type error to use an iteratorFn that resolves to a value", async () => {
    typeof doWork(
      2,
      [1, 2, 3],
      // @ts-expect-error testing error path
      () => Promise.resolve(1),
    );
  });
});
