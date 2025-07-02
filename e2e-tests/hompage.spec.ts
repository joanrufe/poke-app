import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load the homepage with Pokémon cards", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Pokemon Explorer/);

    await expect(
      page.getByText(/^Showing 20 of [0-9]+ Pokémon$/)
    ).toBeVisible();

    //check if first 20 Pokémon Cards are visible
    for (let i = 1; i <= 20; i++) {
      if (i < 10) {
        await expect(page.getByText(`#00${i}`)).toBeVisible();
      } else {
        await expect(page.getByText(`#0${i}`)).toBeVisible();
      }
    }
  });

  test("should load the infinite loader and scroll to bottom", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByText(/^Showing 20 of [0-9]+ Pokémon$/)
    ).toBeVisible();
    await page.getByRole("button", { name: "To Bottom" }).click();
    await expect(
      page.getByText(/^Showing 40 of [0-9]+ Pokémon$/)
    ).toBeVisible();
    await page.getByRole("button", { name: "To Bottom" }).click();
    await expect(
      page.getByText(/^Showing 60 of [0-9]+ Pokémon$/)
    ).toBeVisible();
  });
});
