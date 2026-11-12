
import { describe, it, expect } from "vitest";
import request from "supertest";
import { Router } from "express";
import { createApp } from "../../src/app";
import { PedidoService } from "../../src/services/pedidoService";
import { CafeExpreso } from "../../src/models/CafeExpreso";
import { TomaReportesRouter } from "../../src/routes/reportes.routes";

describe("GET /reportes/facturacion", () => {
  it("devuelve la suma de los pedidos registrados", async () => {
    const producto = new CafeExpreso(1, "Pocillo", "Brasil");

    const catalogo = {
      obtenerProductoPorId: (id: number) =>
        id === 1 ? producto : undefined,
    };

    const pedidoService = new PedidoService(catalogo);

    pedidoService.crearPedido([
      { productoId: 1, cantidad: 1 },
    ]);

    pedidoService.crearPedido([
      { productoId: 1, cantidad: 2 },
    ]);

    const reportesRouter = TomaReportesRouter(pedidoService);

    const app = createApp({
      productos: Router(),
      pedidos: Router(),
      reportes: reportesRouter,
    });

    const res = await request(app).get("/reportes/facturacion");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      facturacionTotal: 15060,
    });
  });
});


describe("GET /reportes/mas-vendido", () => {
  it("devuelve el producto más vendido con su cantidad", async () => {
    const producto1 = new CafeExpreso(1, "Pocillo", "Brasil");
    const producto2 = new CafeExpreso(2, "Pocillo", "Colombia");

    const catalogo = {
      obtenerProductoPorId: (id: number) => {
        if (id === 1) return producto1;
        if (id === 2) return producto2;
        return undefined;
      },
    };

    const pedidoService = new PedidoService(catalogo);

    pedidoService.crearPedido([
      { productoId: 1, cantidad: 3 },
      { productoId: 2, cantidad: 1 },
    ]);

    pedidoService.crearPedido([
      { productoId: 1, cantidad: 2 },
    ]);

    const app = createApp({
      productos: Router(),
      pedidos: Router(),
      reportes: TomaReportesRouter(pedidoService),
    });

    const res = await request(app).get("/reportes/mas-vendido");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      producto: producto1.nombre,
      cantidad: 5,
    });
  });
});
 

describe("GET /reportes/facturacion sin ventas", () => {
  it("devuelve facturación 0 cuando no hay pedidos", async () => {
    const catalogo = {
      obtenerProductoPorId: (_id: number) => undefined,
    };

    const pedidoService = new PedidoService(catalogo);

    const app = createApp({
      productos: Router(),
      pedidos: Router(),
      reportes: TomaReportesRouter(pedidoService),
    });

    const res = await request(app).get("/reportes/facturacion");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      facturacionTotal: 0,
    });
  });
});


describe("GET /reportes/mas-vendido sin ventas", () => {
  it("devuelve 404 cuando no hay ventas registradas", async () => {
    const catalogo = {
      obtenerProductoPorId: (_id: number) => undefined,
    };

    const pedidoService = new PedidoService(catalogo);

    const app = createApp({
      productos: Router(),
      pedidos: Router(),
      reportes: TomaReportesRouter(pedidoService),
    });

    const res = await request(app).get("/reportes/mas-vendido");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: "No hay ventas registradas",
    });
  });
});
