import { describe, expect, it } from "vitest";
import request from "supertest";
import { createConfiguredApp } from "../../src/app";

describe("API integrada", () => {
  it("consulta productos, crea un pedido y refleja las ventas en los reportes", async () => {
    const app = createConfiguredApp();
    const productos = await request(app).get("/productos");

    expect(productos.status).toBe(200);
    expect(productos.body).toHaveLength(20);
    expect(productos.body[4].precio).toBe(7360);

    const pedido = await request(app)
      .post("/pedidos")
      .send({ mesaId: 4, items: [{ productoId: 1, cantidad: 2 }] });

    expect(pedido.status).toBe(201);
    expect(pedido.body.total).toBe(10_040);
    expect(pedido.body.mesaId).toBe(4);

    const pedidoConsultado = await request(app).get(
      `/pedidos/${pedido.body.id}`,
    );
    expect(pedidoConsultado.status).toBe(200);
    expect(pedidoConsultado.body).toMatchObject({
      id: pedido.body.id,
      mesaId: 4,
      estado: "pendiente",
      total: 10_040,
    });

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

  it("ofrece reset y seed deterministas solo para las pruebas", async () => {
    const app = createConfiguredApp();

    const seed = await request(app).post("/__test__/seed");
    expect(seed.status).toBe(204);

    const pedidoSeed = await request(app).get("/pedidos/1");
    expect(pedidoSeed.status).toBe(200);
    expect(pedidoSeed.body).toMatchObject({
      mesaId: 4,
      items: [{ productoId: 19, cantidad: 1 }],
      total: 2500,
    });

    const reset = await request(app).post("/__test__/reset");
    expect(reset.status).toBe(204);
    expect((await request(app).get("/pedidos/1")).status).toBe(404);

    const primerPedido = await request(app)
      .post("/pedidos")
      .send({ items: [{ productoId: 19, cantidad: 1 }] });
    expect(primerPedido.body.id).toBe(1);
  });

  it("devuelve errores JSON con el contrato uniforme", async () => {
    const response = await request(createConfiguredApp())
      .post("/pedidos")
      .set("Content-Type", "application/json")
      .send("{");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "JSON inválido" });
  });

  it("no registra rutas de reset ni seed fuera del entorno de pruebas", async () => {
    const previousEnvironment = process.env.NODE_ENV;

    try {
      process.env.NODE_ENV = "production";
      const app = createConfiguredApp();
      expect((await request(app).post("/__test__/reset")).status).toBe(404);
      expect((await request(app).post("/__test__/seed")).status).toBe(404);
    } finally {
      if (previousEnvironment === undefined) {
        delete process.env.NODE_ENV;
      } else {
        process.env.NODE_ENV = previousEnvironment;
      }
    }
  });
});
