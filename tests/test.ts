import { expect, test } from "@playwright/test";

test("index page has expected h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Go live in minutes" })).toBeVisible();
  await expect(page.getByText("Bootstrap your next SaaS project with this open source SvelteKit template. 🚀")).toBeVisible();
});
