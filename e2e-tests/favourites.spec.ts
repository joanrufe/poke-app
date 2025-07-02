import { test, expect } from "@playwright/test";

test.describe("Favorites", () => {
  test("should display the favorites page and go back home", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Favorites (0)" }).click();
    await page
      .getByRole("heading", { name: "You have no favorites yet" })
      .click();
    await page.getByRole("button", { name: "Back to Home" }).click();
    await expect(page.getByText(/^Showing 20 of [0-9]+ Pokémon/)).toBeVisible();
  });

  test("should go to favorites by typing in the URL", async ({ page }) => {
    await page.goto("/favorites");
    await expect(
      page.getByRole("heading", { name: "You have no favorites yet" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Back to Home" }).click();
    await expect(page.getByText(/^Showing 20 of [0-9]+ Pokémon/)).toBeVisible();
  });

  test("should add and remove a Pokémon from favorites", async ({ page }) => {
    await page.goto("/");
    await page
      .locator("div")
      .filter({ hasText: /^#005$/ })
      .getByRole("button")
      .click();
    await page.getByRole("button", { name: "Favorites (1)" }).click();
    await page.getByText("You have 1 favorite Pokémon").click();
    await page
      .locator("div")
      .filter({ hasText: /^#005$/ })
      .getByRole("button")
      .click();
    await page
      .getByRole("heading", { name: "You have no favorites yet" })
      .click();
  });
});
