import { test, expect } from "@playwright/test";
import { PlaywrightDevPage } from "./utils/playwright-dev-page.js";

test.describe("dev toolbar", () => {
  test.beforeEach(async ({ page }) => {
    const devPage = new PlaywrightDevPage(page);
    await devPage.goto();
    await devPage.clearClipboard();
  });

  test("should have open graph dev toolbar", async ({ page }) => {
    const devPage = new PlaywrightDevPage(page);

    await expect(devPage.opengraphImage).toBeHidden();
    await devPage.goto();
    await devPage.openToolbar();
    await expect(devPage.opengraphImage).toBeVisible();

    await expect(devPage.imageDetails).toHaveCount(1);
    await expect(devPage.imageDetails).toBeVisible();
  });

  test("meta tags should be collapsed by default", async ({ page }) => {
    const devPage = new PlaywrightDevPage(page);
    await devPage.goto();
    await devPage.openToolbar();

    // meta tags should be there, but collapsed at first
    await expect(devPage.descriptionTerms).toHaveCount(4);
    await expect(devPage.descriptionTerms.first()).toBeHidden();

    // Expand Meta Tags <details>
    await devPage.metaTagsDetails.click();
    await expect(devPage.descriptionTerms.first()).toBeVisible();
  });

  test("meta tags should be correct", async ({ page }) => {
    const devPage = new PlaywrightDevPage(page);
    await devPage.goto();
    await devPage.openToolbar();

    // Expand Meta Tags <details>
    await devPage.metaTagsDetails.click();

    await expect(devPage.descriptionTerms).toHaveText([
      "og:image",
      "og:image:type",
      "og:image:width",
      "og:image:height",
    ]);
    await expect(devPage.descriptionDetails).toHaveText([
      "http://localhost:3913/opengraph.png",
      "image/png",
      "1200",
      "630",
    ]);
  });

  test("meta tags should have a link", async ({ page, context }) => {
    const devPage = new PlaywrightDevPage(page);
    await devPage.goto();
    await devPage.openToolbar();

    // Expand Meta Tags <details>
    await devPage.metaTagsDetails.click();

    // click link, wait for new page
    const newPagePromise = context.waitForEvent("page");
    await page.getByRole("link").filter({ hasText: "opengraph.png" }).click();
    const newPage = await newPagePromise;

    // verify it is the image
    expect(newPage.url()).toMatch(/opengraph.png$/);
    await expect(newPage.locator("img")).toBeVisible();
  });

  test("should be able to zoom the image", async ({ page }) => {
    const devPage = new PlaywrightDevPage(page);
    await devPage.goto();
    await devPage.openToolbar();

    await expect(page.getByText("1.00x")).toBeVisible();
    await expect(
      page.getByRole("radio").filter({ hasText: "0.25x" }),
    ).toBeHidden();

    // bring up the zoom bar by hovering the image
    await devPage.opengraphImage.hover();

    await expect(devPage.zoomButtons["0.25x"]).toBeVisible();
    await expect(devPage.zoomButtons["0.50x"]).toBeVisible();
    await expect(devPage.zoomButtons["1.00x"]).toBeVisible();

    // check that zoom works
    await expect(devPage.opengraphImage).toHaveCSS("width", "590px");
    await devPage.zoomButtons["0.25x"].click();
    await expect(devPage.opengraphImage).toHaveCSS("width", "147.5px");
    await devPage.zoomButtons["0.50x"].click();
    await expect(devPage.opengraphImage).toHaveCSS("width", "295px");
    await devPage.zoomButtons["0.75x"].click();
    await expect(devPage.opengraphImage).toHaveCSS("width", "442.5px");
    await devPage.zoomButtons["1.00x"].click();
    await expect(devPage.opengraphImage).toHaveCSS("width", "590px");
  });

  test("should have a button for copying the image URL", async ({ page }) => {
    const devPage = new PlaywrightDevPage(page);
    await devPage.goto();
    await devPage.openToolbar();

    await expect(devPage.copyImageURLButton).toHaveCount(1);
    await expect(devPage.copyImageURLButton).toBeVisible();

    // Verify the button works
    expect(await devPage.readClipboard()).not.toContain("opengraph.png");
    await devPage.copyImageURLButton.click();
    // text should be on clipboard now
    expect(await devPage.readClipboard()).toContain("opengraph.png");

    // Button Text changes ...
    await expect(devPage.copyImageURLButton).toHaveText("Copied to clipboard");
    // But reverts back on its own ...
    await expect(devPage.copyImageURLButton).toHaveText("Copy image URL", {
      timeout: 5_000, // must be longer than actual setTimeout used by button
    });
  });

  test("open/close state should persist across page loads", async ({
    page,
  }) => {
    const devPage = new PlaywrightDevPage(page);

    // initially not visible
    await devPage.goto();
    await expect(devPage.opengraphImage).toBeHidden();

    // explicitly opened and visible
    await devPage.openToolbar();
    await expect(devPage.opengraphImage).toBeVisible();

    // still open on refresh
    await devPage.goto();
    await expect(devPage.opengraphImage).toBeVisible();

    // explicitly closed and not visible
    await devPage.closeToolbar();
    await expect(devPage.opengraphImage).toBeHidden();

    // still closed on refresh
    await devPage.goto();
    await expect(devPage.opengraphImage).toBeHidden();
  });

  test("no opengraph image", async ({ page }) => {
    const devPage = new PlaywrightDevPage(page);
    await devPage.goto("/no-opengraph");
    await devPage.openToolbar();

    // error shown ...
    await expect(devPage.noOpenGraphErrorText).toBeVisible();

    // ... and everything else hidden
    await expect(devPage.opengraphImage).toBeHidden();
    await expect(devPage.imageDetails).toBeHidden();
    await expect(devPage.metaTagsDetails).toBeHidden();
  });
});
