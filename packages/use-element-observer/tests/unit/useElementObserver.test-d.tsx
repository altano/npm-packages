import { assertType, describe, it } from "vitest";
import { useElementObserver } from "../../src";
import React from "react";

describe("useElementObserver", () => {
  it("should allow a ReactElement tree when not using a wrapper div", () => {
    assertType(function Component(): React.ReactElement {
      const [_, observedTree] = useElementObserver({
        tree: <p>Hi</p>,
        selector: "*",
        useWrapperDiv: false,
      });
      return observedTree;
    });
  });

  it("should allow a ReactElement tree when using a wrapper div", () => {
    assertType(function Component(): React.ReactElement {
      const [_, observedTree] = useElementObserver({
        tree: <p>Hi</p>,
        selector: "*",
        useWrapperDiv: true,
      });
      return observedTree;
    });
  });

  it("should allow a ReactNode tree when using a wrapper div", () => {
    assertType(function Component(): React.ReactElement {
      const [_, observedTree] = useElementObserver({
        tree: "asdf" satisfies React.ReactNode,
        selector: "*",
        useWrapperDiv: true,
      });
      return observedTree;
    });
  });

  it("should allow a ReactNode tree when not specifying wrapper div", () => {
    assertType(function Component(): React.ReactElement {
      const [_, observedTree] = useElementObserver({
        tree: "asdf" satisfies React.ReactNode,
        selector: "*",
      });
      return observedTree;
    });
  });

  it("should disallow a ReactNode tree when not using a wrapper div", () => {
    assertType(function Component(): React.ReactElement {
      // @ts-expect-error Type 'string' is not assignable to type 'ReactElementWithRef'
      const [_, observedTree] = useElementObserver({
        tree: "asdf" satisfies React.ReactNode,
        selector: "*",
        useWrapperDiv: false,
      });
      return observedTree;
    });
  });
});
