import { test, expect } from "@playwright/test";
import { StoryPage } from "./page-object-models/storyPage.js";

test("has all headings by default", async ({ page }) => {
  const storyPage = new StoryPage(page, "table-of-contents", "basic");
  await storyPage.goto();

  await expect(page.getByTestId("table-of-contents")).toMatchAriaSnapshot();
});

test("can limit from a depth to a depth", async ({ page }) => {
  const storyPage = new StoryPage(
    page,
    "table-of-contents",
    "from-depth-to-depth",
  );
  await storyPage.goto();

  await expect(page.getByTestId("table-of-contents")).toMatchAriaSnapshot();
});

test("allows customizing styles", async ({ page }) => {
  const storyPage = new StoryPage(page, "table-of-contents", "styled");
  await storyPage.goto();

  await expect(page.getByTestId("table-of-contents")).toMatchAriaSnapshot();

  const advancedConditionalBreakpoints = page.getByText(
    "Advanced Conditional Breakpoints",
  );
  const usingTime = page.getByText("Using Time");
  const skipPageLoad = page.getByText("Skip Page Load");

  // all initially gray
  await expect(advancedConditionalBreakpoints).toHaveCSS(
    "color",
    "rgb(128, 128, 128)",
  );
  await expect(usingTime).toHaveCSS("color", "rgb(128, 128, 128)");
  await expect(skipPageLoad).toHaveCSS("color", "rgb(128, 128, 128)");

  // hover the link
  await skipPageLoad.hover();

  // should have colors now
  await expect(advancedConditionalBreakpoints).toHaveCSS(
    "color",
    "rgb(255, 69, 0)",
  );
  await expect(usingTime).toHaveCSS("color", "rgb(0, 0, 255)");
  await expect(skipPageLoad).toHaveCSS("color", "rgb(0, 255, 255)");
});
