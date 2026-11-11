import { describe, expect, it } from "vitest";
import request from "supertest";
import { createConfiguredApp } from "../../src/app";

describe("API integrada", () => {
  it("consulta productos, crea un pedido y refleja las ventas en los reportes", async () => {
    const app = createConfiguredApp();
    const productos = await request(app).get("/productos");

    expect(productos.status).toBe(200);
    expect(productos.body).toHaveLength(20);

    const pedido = await request(app)
      .post("/pedidos")
      .send({ items: [{ productoId: 1, cantidad: 2 }] });

    expect(pedido.status).toBe(201);
    expect(pedido.body.total).toBe(10_040);

    const facturacion = await request(app).get("/reportes/facturacion");
    expect(facturacion.status).toBe(200);
    expect(facturacion.body).toEqual({ facturacionTotal: 10_040 });

    const masVendido = await request(app).get("/reportes/mas-vendido");
    expect(masVendido.status).toBe(200);
    expect(masVendido.body).toEqual({
      producto: "Café expreso Pocillo Brasil",
      cantidad: 2,
    });
  });
});
