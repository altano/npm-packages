import { test, expect } from "@playwright/test";

// We're not exhaustive here because the screenshot unit tests are
// comprehensive. Here we just make sure we work in a browser, at all. (since
// some code paths diverge in the browser).
test("should have correct font sizes", async ({ page, browserName }) => {
  await page.goto("/");

  // tiny browser differences of 1px are tolerable but have to be accounted for.
  const isWebkit = browserName.includes("webkit");
  const isFirefox = browserName.includes("firefox");

  await expect(page.getByText("Texxt", { exact: true })).toHaveCSS(
    "font-size",
    "85px",
  );

  await expect(page.getByText("Centered Text", { exact: true })).toHaveCSS(
    "font-size",
    "32px",
  );

  await expect(page.getByText("Multiline Text", { exact: true })).toHaveCSS(
    "font-size",
    "54px",
  );

  await expect(
    page.getByText("Vertically Centered Text", { exact: true }),
  ).toHaveCSS("font-size", "48px");

  await expect(
    page.getByText("Centered Multiline Text", { exact: true }),
  ).toHaveCSS("font-size", "48px");

  await expect(
    page.getByText("Set a Maximum Font Size", { exact: true }),
  ).toHaveCSS("font-size", "40px");

  await expect(
    page.getByText("Use Any Letter Spacing", { exact: true }),
  ).toHaveCSS("font-size", isWebkit || isFirefox ? "47px" : "48px");

  await expect(
    page.getByText("Use Any Line Height", { exact: true }),
  ).toHaveCSS("font-size", "39px");

  await expect(
    page.getByText("Use Any Custom Font Face", { exact: true }),
  ).toHaveCSS("font-size", isFirefox ? "42px" : "43px");

  await expect(
    page.getByText("Use Any Custom Padding", { exact: true }),
  ).toHaveCSS("font-size", "37px");

  await expect(
    page.getByText("Use Padding With Flexbox For Custom Vert Alignment!", {
      exact: true,
    }),
  ).toHaveCSS("font-size", "24px");
});
