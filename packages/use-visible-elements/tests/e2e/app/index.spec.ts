import { test, expect } from "@playwright/test";

test.describe("useVisibleElements", async () => {
  test("simple scrolling into view", async ({ page }) => {
    await page.goto("/");

    // initial setup
    await expect(page.getByTestId("visible-element-count")).toBeInViewport();
    await expect(page.getByTestId("visible-element-count")).toHaveText(
      `Visible List Items Count: 0`,
    );
    await expect(page.getByRole("navigation")).not.toBeInViewport();

    // scroll down to make nav visible
    await page.getByRole("navigation").scrollIntoViewIfNeeded();

    // the 2 list items are visible
    await expect(page.getByTestId("visible-element-count")).toHaveText(
      `Visible List Items Count: 2`,
    );
    await expect(page.getByRole("navigation")).toBeInViewport();
  });
});
