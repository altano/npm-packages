import { test, expect } from "@playwright/test";

test("initial load has current headings", async ({ page }) => {
  await page.goto("/basic");

  const currentHeadings = [
    "Lorem ipsum dolor sit amet.",
    "Dignissimos aliquam dolorum assumenda quod!",
    "Explicabo animi iusto velit nisi?",
    "Quam aut alias excepturi. Eligendi?",
  ];
  for (const heading of currentHeadings) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await expect(
      page.getByRole("navigation").locator("li", { hasText: heading }),
    ).toHaveAttribute("aria-current");
  }
});

test("initial load has offscreen headings", async ({ page }) => {
  await page.goto("/basic");

  const offscreenHeadings = [
    "Voluptatem eum temporibus amet sapiente.",
    "Architecto ipsa illum",
    "Saepe laboriosam itaque excepturi eligendi.",
  ];
  for (const heading of offscreenHeadings) {
    await expect(
      page.getByRole("navigation").locator("li", { hasText: heading }),
    ).not.toHaveAttribute("aria-current");
  }
});

test("should change the highlight when scrolling a little", async ({
  page,
}) => {
  await page.goto("/basic");

  const headingsToScrollTo = [
    "Voluptatem eum temporibus amet sapiente.",
    "Est rerum deserunt ut suscipit?",
    // This is the last heading on the page so this is important.
    "Saepe laboriosam itaque excepturi eligendi.",
  ];

  for (const heading of headingsToScrollTo) {
    await page.getByRole("heading", { name: heading }).scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("navigation").locator("li", { hasText: heading }),
    ).toHaveAttribute("aria-current");
  }
});
