import { describe, expect, it } from "vitest";
import { doWorkAndYield } from "../../src/index.js";

const timeout = (i: number): Promise<number> =>
  new Promise<number>((resolve) =>
    setTimeout(() => {
      resolve(i);
    }, i),
  );

describe("doWorkAndYield", function () {
  it("only runs as many promises in parallel as given by the pool limit", async function () {
    const gen = doWorkAndYield(2, [10, 80, 30, 15], timeout);
    expect((await gen.next()).value).to.equal(10);
    expect((await gen.next()).value).to.equal(30);
    expect((await gen.next()).value).to.equal(15);
    expect((await gen.next()).value).to.equal(80);
  });

  it("runs all promises in parallel when the pool is bigger than needed", async function () {
    const gen = doWorkAndYield(5, [10, 50, 30, 20], timeout);
    expect((await gen.next()).value).to.equal(10);
    expect((await gen.next()).value).to.equal(20);
    expect((await gen.next()).value).to.equal(30);
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
    const startedTasks: number[] = [];
    const finishedTasks: number[] = [];
    const timeout = (i: number): Promise<void> => {
      startedTasks.push(i);
      return new Promise<void>((resolve, reject) =>
        setTimeout(() => {
          if (i === 30) {
            reject(new Error("Oops"));
          } else {
            finishedTasks.push(i);
            resolve();
          }
        }, i),
      );
    };

    const gen = doWorkAndYield(2, [10, 50, 30, 20], timeout);
    const step1 = gen.next();
    const step2 = gen.next();
    const step3 = gen.next();
    await expect(step1).resolves.toHaveProperty("value", undefined);
    await expect(step2).rejects.toBeInstanceOf(Error);
    expect(startedTasks).to.deep.equal([10, 50, 30]);
    expect(finishedTasks).to.deep.equal([10]);
    await expect(step3).resolves.toHaveProperty("value", undefined);

    // tasks started before the exception will continue, though - just wait a bit
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 50));
    expect(startedTasks).to.deep.equal([10, 50, 30]);
    expect(finishedTasks).to.deep.equal([10, 50]);
  });
});
