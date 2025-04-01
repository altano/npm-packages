import { assertType, describe, it } from "vitest";
import { Observer } from "../../src/Observer";

describe("Observer", () => {
  it("should allow a ReactElement when not using a wrapper div", () => {
    assertType(
      <Observer selector="*" useWrapperDiv={false}>
        <p>Hi</p>
      </Observer>,
    );
  });

  it("should allow a ReactElement when using a wrapper div", () => {
    assertType(
      <Observer selector="*" useWrapperDiv={true}>
        <p>Hi</p>
      </Observer>,
    );
  });

  it("should allow a ReactNode when using a wrapper div", () => {
    assertType(
      <Observer selector="*" useWrapperDiv={true}>
        asdf
      </Observer>,
    );
  });

  it("should disallow no children", () => {
    // @ts-expect-error Property 'children' is missing in type
    assertType(<Observer selector="*" useWrapperDiv={true} />);
    // @ts-expect-error Property 'children' is missing in type
    assertType(<Observer selector="*" useWrapperDiv={false} />);
  });

  it("should disallow a ReactNode when not using a wrapper div", () => {
    const observer = (
      // @ts-expect-error Type 'string' is not assignable to type 'ReactElementWithRef'.ts(2322)
      <Observer selector="*" useWrapperDiv={false}>
        asdf {/* this is a string (React.Node) and not ReactElement */}
      </Observer>
    );
    assertType(observer);
  });
});
