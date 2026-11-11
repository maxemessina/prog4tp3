
import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app";
import { Router } from "express";
import productosRouter from "../../src/routes/productos.routes";

const app = createApp({
  productos: productosRouter,
  pedidos: Router(),
  reportes: Router(),
});

describe("GET /productos", () => {
  it("devuelve el catálogo completo de productos", async () => {
    const response = await request(app).get("/productos");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(20);
  });
  describe("GET /productos/:id", () => {
  it("devuelve un producto cuando el ID existe", async () => {
    const response = await request(app).get("/productos/1");

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.nombre).toBe("Café expreso Pocillo Brasil");
  });

  it("devuelve 400 cuando el ID no es válido", async () => {
    const response = await request(app).get("/productos/abc");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "ID de producto inválido",
    });
  });

  it("devuelve 404 cuando el producto no existe", async () => {
    const response = await request(app).get("/productos/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "Producto no encontrado",
    });
  });
});
});

