import { expect, test } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  const reset = await request.post("http://127.0.0.1:3000/__test__/reset");
  expect(reset.status()).toBe(204);

  const seed = await request.post("http://127.0.0.1:3000/__test__/seed");
  expect(seed.status()).toBe(204);
});

test("abre el menú de una mesa y muestra productos de la API real", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/?mesa=4");

  await expect(
    page.getByRole("heading", { name: "Cafetería Origen" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mesa 4" })).toBeVisible();
  await expect(page.getByText("Café expreso Mediano Colombia")).toBeVisible();
  await expect(page.getByText("Muffin de chocolate")).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
