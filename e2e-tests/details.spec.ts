import { test, expect } from "@playwright/test";

test.describe("Details", () => {
  test("Should go to details page by clicking on a pokemon card", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /bulbasaur/i }).click();
    await expect(page.getByText("Bulbasaur")).toBeVisible();
  });
  test("Should go to details page by typing in the URL", async ({ page }) => {
    await page.goto("/pokemon/1");
    await expect(page.getByText("Bulbasaur")).toBeVisible();
  });
  test("Should display pokemon Stats", async ({ page }) => {
    await page.goto("/pokemon/1");
    await expect(page.getByText("Stats")).toBeVisible();
    await expect(page.getByText(/^HP\d+$/i)).toBeVisible();
    await expect(page.getByText(/^Attack\d+$/i)).toBeVisible();
    await expect(page.getByText(/^Defense\d+$/i)).toBeVisible();
    await expect(page.getByText(/^Special Attack\d+$/i)).toBeVisible();
    await expect(page.getByText(/^Special Defense\d+$/i)).toBeVisible();
    await expect(page.getByText(/^Speed\d+$/i)).toBeVisible();
  });
  test("Should display pokemon Moves and open tooltip with more info on click", async ({
    page,
  }) => {
    await page.goto("/pokemon/1");
    await expect(
      page.getByText(/Moves Click on each move for more details/i)
    ).toBeVisible();

    // display a bunch of moves
    await expect(page.getByText("swords dance")).toBeVisible();
    await expect(page.getByText("cut")).toBeVisible();
    await expect(page.getByText("bind")).toBeVisible();
    await expect(page.getByText("vine whip")).toBeVisible();
    await expect(page.getByText("headbutt")).toBeVisible();

    // Open tooltip for a specific move
    await page.getByText(/razor wind/i).click();
    // Check content of the tooltip
    await expect(page.getByText(/Power: 80/i)).toBeVisible();
    await expect(page.getByText(/Accuracy: 100/i)).toBeVisible();
    await expect(page.getByText(/PP: 10/i)).toBeVisible();
    await expect(page.getByText(/Priority: 0/i)).toBeVisible();
  });
});
