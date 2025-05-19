import type { Page, Response } from "@playwright/test";

export class StoryPage {
  constructor(
    public page: Page,
    public component: string,
    public story: string,
  ) {
    this.page = page;
  }

  async goto(): Promise<Response | null> {
    return this.page.goto(`/dashboard/stories/${this.component}/${this.story}`);
  }
}
