import { render } from "@testing-library/react";
import { useElementObserver, type Options } from "../../src";
import React from "react";
import { describe, it, expect, vi } from "vitest";

function Component({
  handleMount,
  hookOptions = {},
}: {
  handleMount: (els: Set<Element>) => void;
  hookOptions?: Partial<Options>;
}): React.ReactElement {
  const [mountedElements, observedTree] = useElementObserver({
    tree: (
      <nav>
        <ul>
          <li>Some stuff</li>
          <li>Some more stuff</li>
        </ul>
      </nav>
    ),
    selector: "nav > ul > li",
    ...hookOptions,
  });
  React.useEffect(() => {
    handleMount(mountedElements);
  }, [handleMount, mountedElements]);
  return <div data-testid="Component">{observedTree}</div>;
}

describe("useElementObserver", async () => {
  it("returns mounted elements", async () => {
    const handleMount = vi.fn((_elements: Set<Element>) => {});
    const { findByRole } = render(<Component handleMount={handleMount} />);

    expect(handleMount).toHaveBeenCalledTimes(1);
    const firstCall = handleMount.mock.calls[0]!;
    const params = firstCall[0];
    const [firstEl, secondEl] = params.values();

    expect(firstEl).toHaveProperty("tagName", "LI");
    expect(secondEl).toHaveProperty("tagName", "LI");
    expect(firstEl).toHaveTextContent(`Some stuff`);
    expect(secondEl).toHaveTextContent(`Some more stuff`);

    expect(await findByRole("navigation")).toHaveTextContent("Some stuff");
  });

  it("uses a wrapper div", async () => {
    const handleMount = vi.fn((_elements: Set<Element>) => {});
    const { findByTestId } = render(
      <Component
        handleMount={handleMount}
        hookOptions={{ useWrapperDiv: true }}
      />,
    );
    const tree = await findByTestId("Component");
    expect(tree.innerHTML).toMatchInlineSnapshot(
      `"<div style="display: inherit;"><nav><ul><li>Some stuff</li><li>Some more stuff</li></ul></nav></div>"`,
    );
  });

  it("does NOT use a wrapper div", async () => {
    const handleMount = vi.fn((_elements: Set<Element>) => {});
    const { findByTestId } = render(
      <Component
        handleMount={handleMount}
        hookOptions={{ useWrapperDiv: false }}
      />,
    );
    const tree = await findByTestId("Component");
    expect(tree.innerHTML).toMatchInlineSnapshot(
      `"<nav><ul><li>Some stuff</li><li>Some more stuff</li></ul></nav>"`,
    );
  });
});
