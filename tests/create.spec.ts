import { test, expect } from "@playwright/test";
import { BASE_API_URL } from "../src/constants";

test("create a book", async ({ page }) => {
  await page.route(BASE_API_URL, async (route) => {
    const json = [];
    await route.fulfill({ json });
  });

  await page.goto("/");
  await page.getByText("Create Book").click();

  await expect(page.getByText("Submit")).toHaveAttribute("disabled");

  await page.getByTestId("input-title").fill("Title");
  await page.getByTestId("input-author").fill("Author");
  await page.getByTestId("input-description").fill("Description");
  await page.getByTestId("input-cover").fill("https://test");
  await page.getByTestId("input-publicationDate").fill("2018-04-14");

  await expect(page.getByText("Submit")).not.toHaveAttribute("disabled");

  await page.getByText("Submit").click();
  await page.getByText("Back").click();

  await expect(page.getByTestId("book").nth(0)).toContainText("Title");
  await expect(page.getByTestId("book-button-menu")).toHaveCount(1);
});

test("asserting errors", async ({ page }) => {
  await page.goto("/create");

  await expect(page.getByText("Submit")).toHaveAttribute("disabled");

  await page.getByTestId("input-title").fill("");
  await page.getByTestId("input-author").fill("");
  await page.getByTestId("input-cover").fill("");
  await page.getByTestId("input-description").fill("Description"); // await doesn't fully resolve queue stack, so last input change doesn't trigger error. Why? I'm not sure. Maybe a case of duplicate rendering? Unsure.

  await expect(page.getByText("Title is required.")).toHaveCount(1);
  await expect(page.getByText("Author is required.")).toHaveCount(1);
  await expect(page.getByText("Cover needs to be a URL.")).toHaveCount(1);
  await expect(page.getByText("Submit")).toHaveAttribute("disabled");

  await page.getByTestId("input-title").fill("Title");
  await page.getByTestId("input-description").fill("Description"); // Same reason as above.
  await expect(page.getByText("Title is required.")).toHaveCount(0);
  await expect(page.getByText("Submit")).toHaveAttribute("disabled");

  await page.getByTestId("input-author").fill("Author");
  await page.getByTestId("input-description").fill("Description"); // Same reason as above.
  await expect(page.getByText("Author is required.")).toHaveCount(0);
  await expect(page.getByText("Submit")).toHaveAttribute("disabled");

  await page.getByTestId("input-cover").fill("https://test");
  await page.getByTestId("input-description").fill("Description"); // Same reason as above.
  await expect(page.getByText("Cover needs to be a URL.")).toHaveCount(0);
  await expect(page.getByText("Submit")).toHaveAttribute("disabled");

  await page.getByTestId("input-description").fill("Description");
  await page.getByTestId("input-publicationDate").fill("2018-04-14");

  await expect(page.getByText("Submit")).not.toHaveAttribute("disabled");
});
