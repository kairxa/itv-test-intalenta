import { test, expect } from "@playwright/test";
import { BASE_API_URL } from "../src/constants";
import { MockBookGetData } from "./mockData";

test("shows a list of books", async ({ page }) => {
  await page.route(BASE_API_URL, async (route) => {
    const json = MockBookGetData;
    await route.fulfill({ json });
  });

  await page.goto("/");

  await expect(page.getByTestId("book")).toHaveCount(5);
  await expect(page.getByTestId("book-button-menu")).toHaveCount(0);
  await expect(page.getByText("PREVIOUS")).toHaveCount(0);
  await expect(page.getByText("NEXT")).toHaveCount(1);
});

test("asserting navigations", async ({ page }) => {
  await page.route(BASE_API_URL, async (route) => {
    const json = MockBookGetData;
    await route.fulfill({ json });
  });

  await page.goto("/");

  await page.getByText("NEXT").click();

  await expect(page.getByText("PREVIOUS")).toHaveCount(1);
  await expect(page.getByText("NEXT")).toHaveCount(1);

  await page.getByText("NEXT").click();
  await page.getByText("NEXT").click();

  await expect(page.getByText("PREVIOUS")).toHaveCount(1);
  await expect(page.getByText("NEXT")).toHaveCount(0);
});

test("asserting sort by favorites", async ({ page }) => {
  await page.route(BASE_API_URL, async (route) => {
    const json = MockBookGetData;
    await route.fulfill({ json });
  });

  await page.goto("/");

  await page.getByText("Showing favorites first").click();

  await expect(page.getByTestId("book").nth(0)).toContainText(
    "To Kill a Mockingbird",
  );

  await page.getByTestId("book-button-favorite").nth(4).click();

  await expect(page.getByTestId("book").nth(0)).toContainText(
    "Brave New World",
  );
});
