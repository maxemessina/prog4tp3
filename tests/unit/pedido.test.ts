
import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

import { createApp } from "../../src/app";
import { PedidoService } from "../../src/services/pedidoService";
import { Producto } from "../../src/models/Producto";
import { crearPedidosRouter } from "../../src/routes/pedidos.routes";

// Producto concreto para utilizar en las pruebas
class ProductoPrueba extends Producto {
  calcularPrecio(): number {
    return this.precioBase;
  }
}

// Simulamos la búsqueda de productos
const productos = [
  new ProductoPrueba(1, "Café", 1500),
  new ProductoPrueba(2, "Medialuna", 800),
];

const productoLookup = {
  obtenerProductoPorId(id: number): Producto | undefined {
    return productos.find((producto) => producto.id === id);
  },
};

describe("Rutas de pedidos", () => {
  let app: express.Express;

  beforeEach(() => {
    const pedidoService = new PedidoService(productoLookup);

  const pedidosRouter = crearPedidosRouter(pedidoService);
    
    //reemplazo el router vacio x el router real
    app = createApp({
      productos: express.Router(),
      pedidos: pedidosRouter,
      reportes: express.Router(),
    });
  });

  it("POST /pedidos - debería crear un pedido correctamente", async () => {
    const response = await request(app)
      .post("/pedidos")
      .send({
        items: [
          { productoId: 1, cantidad: 2 },
          { productoId: 2, cantidad: 3 },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.items).toHaveLength(2);
    expect(response.body.total).toBe(5400);
  });

  it("POST /pedidos - debería rechazar un pedido vacío", async () => {
    const response = await request(app)
      .post("/pedidos")
      .send({ items: [] });

    expect(response.status).toBe(400);
  });

  it("POST /pedidos - debería rechazar cantidades negativas", async () => {
    const response = await request(app)
      .post("/pedidos")
      .send({
        items: [{ productoId: 1, cantidad: -2 }],
      });

    expect(response.status).toBe(400);
  });

  it("GET /pedidos - debería devolver todos los pedidos", async () => {
    const response = await request(app).get("/pedidos");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("GET /pedidos/:id - debería devolver un pedido existente", async () => {
    const crearPedido = await request(app)
      .post("/pedidos")
      .send({
        items: [{ productoId: 1, cantidad: 2 }],
      });

    const id = crearPedido.body.id;

    const response = await request(app).get(`/pedidos/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(id);
  });

  it("GET /pedidos/:id - debería devolver 404 si el pedido no existe", async () => {
    const response = await request(app).get("/pedidos/999");

    expect(response.status).toBe(404);
  });
});
