import { assertType, describe, expectTypeOf, it } from "vitest";
import { doWork } from "../../src/index.js";

describe("doWork", () => {
  it("should require an iteratorFn whose promise resolves to nothing", () => {
    expectTypeOf(doWork).parameter(2).returns.toEqualTypeOf<Promise<void>>();
  });

  // There's no negated `toBeCallableWith` (`.not` resolves to `never`), so the
  // ts-expect-error is what does the asserting here. Wrapping the call in
  // `assertType` makes it the subject of a real assertion rather than a test
  // body with nothing in it -- don't unwrap it and silence the linter instead.
  it("should reject an iteratorFn that resolves to a value", () => {
    assertType(
      doWork(
        2,
        [1, 2, 3],
        // @ts-expect-error the resolved value would be silently ignored
        () => Promise.resolve(1),
      ),
    );
  });

  it("should accept an iteratorFn that resolves to nothing", () => {
    expectTypeOf(doWork).toBeCallableWith(2, [1, 2, 3], () =>
      Promise.resolve(),
    );
  });
});
