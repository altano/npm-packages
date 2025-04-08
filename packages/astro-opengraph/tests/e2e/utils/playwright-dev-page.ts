// https://playwright.dev/docs/pom

import { expect, type Locator, type Page } from "@playwright/test";

export class PlaywrightDevPage {
  readonly appToolbarButton: Locator;
  readonly copyImageURLButton: Locator;
  readonly descriptionDetails: Locator;
  readonly descriptionList: Locator;
  readonly descriptionTerms: Locator;
  readonly imageDetails: Locator;
  readonly metaTagsDetails: Locator;
  readonly noOpenGraphErrorText: Locator;
  readonly opengraphImage: Locator;
  readonly page: Page;
  readonly zoomButtons: Record<"0.25x" | "0.50x" | "0.75x" | "1.00x", Locator>;

  constructor(page: Page) {
    this.appToolbarButton = page.locator(
      `button[data-app-id="@altano/astro-opengraph"]`,
    );
    this.copyImageURLButton = page
      .locator("astro-dev-toolbar-button")
      .filter({ hasText: /(Copy image URL)|(Copied to clipboard)/ });
    this.imageDetails = page.getByText("Image", { exact: true });
    this.metaTagsDetails = page.getByText("Meta Tags", { exact: true });

    this.descriptionList = page.getByTestId("astro-opengraph-toolbar");
    this.descriptionDetails = this.descriptionList.locator("dd");
    this.descriptionTerms = this.descriptionList.locator("dt");
    this.opengraphImage = page.locator(`img[src$="opengraph.png"]`);
    this.page = page;
    this.zoomButtons = {
      "0.25x": page.getByRole("radio").filter({ hasText: "0.25x" }),
      "0.50x": page.getByRole("radio").filter({ hasText: "0.50x" }),
      "0.75x": page.getByRole("radio").filter({ hasText: "0.75x" }),
      "1.00x": page.getByRole("radio").filter({ hasText: "1.00x" }),
    };
    this.noOpenGraphErrorText = page.getByText(
      "No Open Graph image found on this page",
    );
  }

  async goto(url: string = "/"): Promise<void> {
    await this.page.goto(url);
  }

  async openToolbar(): Promise<void> {
    await this.appToolbarButton.click();
    await expect(
      this.opengraphImage.or(this.noOpenGraphErrorText),
    ).toBeVisible();
  }

  async closeToolbar(): Promise<void> {
    await this.appToolbarButton.click();
    await expect(
      this.opengraphImage.and(this.noOpenGraphErrorText),
    ).toBeHidden();
  }

  async readClipboard(): Promise<string> {
    return this.page.evaluate(() => navigator.clipboard.readText());
  }

  async clearClipboard(): Promise<void> {
    return this.page.evaluate(() => navigator.clipboard.writeText(""));
  }
}
