import { render } from "@testing-library/react";
import { useMountRef, type Callbacks } from "../../src/useMountRef";

function BadComponent({
  onMount,
  onUnmount,
}: Callbacks<HTMLDivElement>): React.ReactElement {
  useMountRef<HTMLDivElement>({ onMount, onUnmount });
  return <div>No Ref</div>;
}

function Component({
  onMount,
  onUnmount,
}: Callbacks<HTMLDivElement>): React.ReactElement {
  const mountRef = useMountRef<HTMLDivElement>({ onMount, onUnmount });
  return <div ref={mountRef}>Hello</div>;
}

describe("useMountRef", async () => {
  it("should not get called if ref not used", async () => {
    const onMount = vi.fn((_: HTMLDivElement) => {});
    const onUnmount = vi.fn((_: HTMLDivElement) => {});
    render(<BadComponent onMount={onMount} onUnmount={onUnmount} />);
    expect(onMount).not.toBeCalled();
    expect(onUnmount).not.toBeCalled();
  });

  it("should handle the initial state", () => {
    const onMount = vi.fn((_: HTMLDivElement) => {});
    const onUnmount = vi.fn((_: HTMLDivElement) => {});
    const { unmount } = render(
      <Component onMount={onMount} onUnmount={onUnmount} />,
    );
    expect(onMount).toBeCalledTimes(1);
    expect(onMount.mock.calls[0]![0]).toHaveTextContent(`Hello`);

    expect(onUnmount).not.toBeCalled();
    unmount();
    expect(onUnmount).toHaveBeenCalledTimes(1);
  });
});
