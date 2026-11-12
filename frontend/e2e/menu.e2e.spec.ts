import { expect, test } from "@playwright/test";

type ProductoE2E = {
  id: number;
  tipo: string;
  nombre: string;
  precio: number;
  tamanio?: string;
  variedad?: {
    nombre: string;
    descripcion: string;
  };
};

type PedidoE2E = {
  id: number;
  mesaId?: number;
  items: Array<{ productoId: number; cantidad: number }>;
  estado: string;
  total: number;
};

test.beforeEach(async ({ request }) => {
  const reset = await request.post("http://127.0.0.1:3000/__test__/reset");
  expect(reset.status()).toBe(204);

  const seed = await request.post("http://127.0.0.1:3000/__test__/seed");
  expect(seed.status()).toBe(204);
});

test("permite elegir, confirmar y consultar un pedido desde una mesa", async ({
  page,
  request,
}) => {
  const productosResponse = await request.get(
    "http://127.0.0.1:3000/productos",
  );
  expect(productosResponse.ok()).toBe(true);

  const productos: ProductoE2E[] = await productosResponse.json();
  const cafe = productos.find(
    (producto) =>
      producto.nombre === "Café expreso Mediano Colombia" &&
      producto.tipo === "expreso",
  );
  const muffin = productos.find(
    (producto) =>
      producto.nombre === "Muffin de chocolate" &&
      producto.tipo === "pasteleria",
  );

  if (!cafe?.variedad || !muffin) {
    throw new Error("La API de prueba no devolvió el café y el muffin esperados.");
  }

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/?mesa=4");

  await expect(
    page.getByRole("heading", { name: "Cafetería Origen" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mesa 4" })).toBeVisible();

  await page.getByRole("button", { name: "Expreso" }).click();
  await page.getByRole("button", { name: "Mediano" }).click();
  await page.getByRole("button", { name: "Colombia" }).click();

  await expect(
    page.getByRole("button", { name: "Expreso" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(cafe.variedad.descripcion)).toBeVisible();
  const precioCafe = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(cafe.precio);
  await expect(page.getByText(`Precio: ${precioCafe}`)).toBeVisible();
  await page.getByRole("button", { name: "Agregar café" }).click();

  const muffinCard = page
    .getByRole("article")
    .filter({ hasText: muffin.nombre });
  await muffinCard.getByRole("button", { name: "Agregar" }).click();

  const carrito = page.getByRole("heading", { name: "Carrito" }).locator("..");
  await expect(carrito).toContainText(cafe.nombre);
  await expect(carrito).toContainText(muffin.nombre);
  await expect(carrito.getByText("Cantidad: 1")).toHaveCount(2);

  const crearPedidoResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith("/pedidos") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Confirmar pedido" }).click();
  const crearPedidoResponse = await crearPedidoResponsePromise;
  expect(crearPedidoResponse.ok()).toBe(true);

  const pedido: PedidoE2E = await crearPedidoResponse.json();
  expect(crearPedidoResponse.request().postDataJSON()).toEqual({
    mesaId: 4,
    items: [
      { productoId: cafe.id, cantidad: 1 },
      { productoId: muffin.id, cantidad: 1 },
    ],
  });
  expect(pedido.mesaId).toBe(4);
  expect(pedido.total).toBe(cafe.precio + muffin.precio);

  await expect(
    page.getByRole("heading", { name: `Pedido #${pedido.id}` }),
  ).toBeVisible();
  await expect(page.getByText(`Estado: ${pedido.estado}`)).toBeVisible();
  await expect(page.getByText("El carrito está vacío")).toBeVisible();

  const actualizarPedidoResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith(`/pedidos/${pedido.id}`) &&
      response.request().method() === "GET",
  );
  await page.getByRole("button", { name: "Actualizar estado" }).click();
  const actualizarPedidoResponse = await actualizarPedidoResponsePromise;
  expect(actualizarPedidoResponse.ok()).toBe(true);

  await expect(
    page.getByRole("status"),
  ).toContainText(`pedido continúa ${pedido.estado}`);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
