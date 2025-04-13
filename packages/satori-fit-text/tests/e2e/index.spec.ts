import { test, expect } from "@playwright/test";

// We're not exhaustive here because the screenshot unit tests are
// comprehensive. Here we just make sure we work in a browser, at all. (since
// some code paths diverge in the browser).
test("works in a real browser", async ({ page }) => {
  await page.goto("/");

  // wait for everything to finish loading
  await expect(
    page.getByText("Computing largest possible font size..."),
  ).toHaveCount(
    0,
    { timeout: 15_000 } /* CI is slow and this might take a bit to run */,
  );

  await expect(
    page
      .getByText(
        "asdofi ajsdofi ajpsdofi japsodif japsoid fjapoisd jfpaoisdj fpaoisd jfpoais djfpoia sdjfpoisadf",
      )
      .first(),
  ).toHaveCSS("font-size", "105px");

  await expect(page.getByText("Hello I am the heading").first()).toHaveCSS(
    "font-size",
    "146px",
  );
});
