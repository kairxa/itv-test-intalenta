import { test, expect } from "@playwright/test";
import { BASE_API_URL } from "../src/constants";

test("edit a book", async ({ page }) => {
  await page.route(BASE_API_URL, async (route) => {
    const json = [];
    await route.fulfill({ json });
  });

  await page.goto("/");
  await page.getByText("Create Book").click();

  await page.getByTestId("input-title").fill("Title");
  await page.getByTestId("input-author").fill("Author");
  await page.getByTestId("input-description").fill("Description");
  await page.getByTestId("input-cover").fill("https://test");
  await page.getByTestId("input-publicationDate").fill("2018-04-14");

  await page.getByText("Submit").click();
  await page.getByText("Back").click();

  await page.getByTestId("book-button-menu").click();
  await page.getByText("Edit").click();

  await page.getByTestId("input-title").fill("Title New Edited");

  await page.getByText("Submit").click();
  await page.getByText("Back").click();

  await expect(page.getByTestId("book").nth(0)).toContainText(
    "Title New Edited",
  );
});
