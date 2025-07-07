import { test, expect } from "@playwright/test";
import { StoryPage } from "./page-object-models/storyPage.js";

test("initial load has current headings", async ({ page }) => {
  const storyPage = new StoryPage(
    page,
    "table-of-contents-with-scroll-spy",
    "basic",
  );
  await storyPage.goto();

  const currentHeadings = [
    "Advanced Conditional Breakpoints",
    "Logpoints / Tracepoints",
  ];
  for (const heading of currentHeadings) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await expect(
      page.getByRole("navigation").locator("a", { hasText: heading }),
    ).toHaveAttribute("aria-current", "true");
  }
});

test("initial load has offscreen headings", async ({ page }) => {
  const storyPage = new StoryPage(
    page,
    "table-of-contents-with-scroll-spy",
    "basic",
  );
  await storyPage.goto();

  const offscreenHeadings = [
    "Watch Pane",
    "From a Specific Instance",
    "monitor() class Calls",
    "Inspect an Elusive Element",
  ];
  for (const heading of offscreenHeadings) {
    await expect(
      page.getByRole("navigation").locator("a", { hasText: heading }),
    ).not.toHaveAttribute("aria-current", "true");
  }
});

test("should change the highlight when scrolling a little", async ({
  page,
}) => {
  const storyPage = new StoryPage(
    page,
    "table-of-contents-with-scroll-spy",
    "basic",
  );
  await storyPage.goto();

  const headingsToScrollTo = [
    "Break on Function Arity Mismatch",
    "Call and Debug a Function",
    // This is the last heading on the page so this is important.
    "Footnotes",
  ];

  for (const heading of headingsToScrollTo) {
    await page.getByRole("heading", { name: heading }).scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("navigation").locator("a", { hasText: heading }),
    ).toHaveAttribute("aria-current", "true");
  }
});

/**
 * Prevent regression of found bug.
 */
test("clicking on first sub-heading in section should not mark all sibling sub-headings as current", async ({
  page,
}) => {
  const storyPage = new StoryPage(
    page,
    "table-of-contents-with-scroll-spy",
    "basic",
  );
  await storyPage.goto();

  await page
    .getByRole("heading", { name: "Inspect the DOM with JS Disabled" })
    .scrollIntoViewIfNeeded();
  await expect(
    page
      .getByRole("navigation")
      .locator("a", { hasText: "Inspect the DOM with JS Disabled" }),
  ).toHaveAttribute("aria-current", "true");

  const headingsThatShouldNotBeCurrent = [
    "Record Snapshots of the DOM",
    "Monitor Focused Element",
    "Find Bold Elements",
    "Just Descendants",
    "Reference Currently Selected Element",
  ];
  for (const heading of headingsThatShouldNotBeCurrent) {
    await expect(
      page.getByRole("navigation").locator("a", { hasText: heading }),
    ).not.toHaveAttribute("aria-current");
  }
});
