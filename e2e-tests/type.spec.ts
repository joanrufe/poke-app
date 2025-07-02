import page from "@/app/type/[typeName]/page";
import { test, expect } from "@playwright/test";

test.describe("Type", () => {
  test("Should go to type page by clicking on a pokemon type", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "fire" }).first().click();
    await expect(
      page.getByRole("heading", { name: "Type fire" })
    ).toBeVisible();
  });

  test("Should go to type page by typing in the URL", async ({ page }) => {
    await page.goto("/type/grass");
    await expect(
      page.getByRole("heading", { name: "Type grass" })
    ).toBeVisible();
  });

  test("Should display type information sections and list of pokemon", async ({
    page,
  }) => {
    await page.goto("/type/fire");
    await expect(page.getByText("Effective against")).toBeVisible();
    await expect(page.getByText("Weak against")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Super effective (2x damage)" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Not very effective (0.5x" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Weak to (takes 2x damage)" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Resists (takes 0.5x damage)" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: /fire type Pokémon\(20 of [0-9]+\ loaded\)/,
      })
    ).toBeVisible();
  });
});
