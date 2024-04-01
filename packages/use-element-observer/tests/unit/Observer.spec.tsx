import { render } from "@testing-library/react";
import { Observer } from "../../src/Observer";
import { describe, it, expect, vi } from "vitest";

describe("Observer", async () => {
  it("should complain if context isn't used", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => {
      render(
        <Observer selector="ul > li" useWrapperDiv={false}>
          <ul>
            <li>hihi</li>
          </ul>
        </Observer>,
      );
    }).toThrowErrorMatchingInlineSnapshot(`[Error: Observer context was null]`);
  });
});
