import { useElementObserver } from "./useElementObserver";

describe("useElementObserver", () => {
  it("should work", () => {
    expect(useElementObserver()).toEqual("use-element-observer");
  });
});
