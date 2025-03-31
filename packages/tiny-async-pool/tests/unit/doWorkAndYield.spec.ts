import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest";
import { doWorkAndYield } from "../../src/index.js";

const timeout = (i: number): Promise<number> =>
  new Promise<number>((resolve) =>
    setTimeout(() => {
      resolve(i);
    }, i),
  );

describe("doWorkAndYield", function () {
  let setTimeoutSpy: MockInstance<typeof setTimeout>;

  beforeEach(() => {
    vi.useFakeTimers();
    setTimeoutSpy = vi.spyOn(global, "setTimeout");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be using a fake timer", async () => {
    expect(setTimeoutSpy).toHaveBeenCalledTimes(0);

    const r = expect(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(100);
        }, 300);
      }),
    ).resolves.toEqual(100);

    vi.runAllTimers();

    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);

    await r;
  });

  it("only runs as many promises in parallel as given by the pool limit", async function () {
    expect(setTimeoutSpy).not.toHaveBeenCalled();

    const poolSize = 2;
    const values = [10, 80, 30, 15];
    const gen = doWorkAndYield(poolSize, values, timeout);

    for (let i = 0; i < values.length; ++i) {
      const promise = gen.next();
      const expectedSetTimeoutCalls = Math.min(values.length, poolSize + i);
      expect(setTimeoutSpy).toHaveBeenCalledTimes(expectedSetTimeoutCalls);
      vi.runAllTimers();
      const next = await promise;
      const expectedValue = values[i];
      expect(next.value).to.equal(expectedValue);
    }
  });

  it("runs all promises in parallel when the pool is bigger than needed", async function () {
    const poolSize = 5;
    const values = [10, 50, 30, 20];
    const gen = doWorkAndYield(poolSize, values, timeout);

    expect(setTimeoutSpy).not.toHaveBeenCalled();

    const promise = gen.next();
    // all 4 setTimeout calls happened on the first loop iteration b/c pool was
    // large enough
    expect(setTimeoutSpy).toHaveBeenCalledTimes(4);
    vi.advanceTimersByTime(10);
    const next = await promise;
    expect(next.value).to.equal(10);
    vi.advanceTimersByTime(10);
    expect((await gen.next()).value).to.equal(20);
    vi.advanceTimersByTime(10);
    expect((await gen.next()).value).to.equal(30);
    vi.advanceTimersByTime(20);
    expect((await gen.next()).value).to.equal(50);
  });

  it("runs all promises even if they are fullfilled within the same tick (#42)", async function () {
    const gen = doWorkAndYield(2, [10, 50, 30, 20], (x) => Promise.resolve(x));
    expect((await gen.next()).value).to.equal(10);
    expect((await gen.next()).value).to.equal(50);
    expect((await gen.next()).value).to.equal(30);
    expect((await gen.next()).value).to.equal(20);
  });

  it("rejects on error (but does not leave unhandled rejections) (1/2)", async function () {
    const timeout = (): Promise<never> => Promise.reject();
    const gen = doWorkAndYield(5, [10, 50, 30, 20], timeout);
    await expect(gen.next()).rejects.toBeUndefined();
    // check console - no UnhandledPromiseRejectionWarning should appear
  });

  it("rejects on error (but does not leave unhandled rejections) (2/2)", async function () {
    const gen = doWorkAndYield(2, [0, 1, 2], (i, a) =>
      i < a.length - 1 ? Promise.resolve(i) : Promise.reject(i),
    );
    expect((await gen.next()).value).to.equal(0);
    expect((await gen.next()).value).to.equal(1);
    await expect(gen.next()).rejects.toEqual(2);
    // check console - no UnhandledPromiseRejectionWarning should appear
  });

  it("rejects as soon as first promise rejects", async function () {
    // const testEpoch = vi.getMockedSystemTime()!.getTime();
    // function getTimeFromEpoch() {
    //   return vi.getMockedSystemTime()!.getTime() - testEpoch;
    // }
    function advanceTimeBy(ms: number): void {
      vi.advanceTimersByTime(ms);
      // console.debug(
      //   `[time] advanced time to ${getTimeFromEpoch()} (pending timers: ${vi.getTimerCount()})`,
      // );
    }

    const startedTasks: number[] = [];
    const finishedTasks: number[] = [];
    const timeout = (i: number): Promise<number> => {
      startedTasks.push(i);
      return new Promise<number>((resolve, reject) => {
        // console.debug(`calling setTimeout(..., ${i})`);
        return setTimeout(() => {
          if (i === 30) {
            reject(new Error("Oops"));
          } else {
            finishedTasks.push(i);
            resolve(i);
          }
        }, i);
      });
    };

    const gen = doWorkAndYield(2, [10, 50, 30, 20], timeout);
    const step1 = gen.next();
    const step2 = gen.next();
    const step3 = gen.next();
    const step4 = gen.next();

    expect(setTimeoutSpy).toHaveBeenCalledTimes(2);
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.anything(), 10);
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.anything(), 50);

    advanceTimeBy(10); // now at +10ms, first 10ms timer completes

    await expect(step1).resolves.toHaveProperty("value", 10);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(3);
    expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.anything(), 30);

    advanceTimeBy(30); // now at +40ms; 30ms timer was started at 10ms so it completes, 50ms timer is still incomplete

    expect(setTimeoutSpy).toHaveBeenCalledTimes(3); // 20ms timer never starts because 30ms timer rejected, so we still only have 3 timers

    await expect(step2).rejects.toBeInstanceOf(Error); // 50ms timer rejects because 30ms timer rejected
    expect(startedTasks).to.deep.equal([10, 50, 30]);
    expect(finishedTasks).to.deep.equal([10]);

    await expect(step3).resolves.toStrictEqual({
      value: undefined,
      done: true,
    }); // iteration is complete because we rejected
    await expect(step4).resolves.toStrictEqual({
      value: undefined,
      done: true,
    }); // iteration is complete because we rejected

    // tasks started before the exception will continue, though - just wait a bit
    expect(startedTasks).to.deep.equal([10, 50, 30]);
    expect(finishedTasks).to.deep.equal([10]);
    advanceTimeBy(100); // now at +140ms, 50ms timer internally resolves
    expect(startedTasks).to.deep.equal([10, 50, 30]);
    expect(finishedTasks).to.deep.equal([10, 50]);
  });
});
