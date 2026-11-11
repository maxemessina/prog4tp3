import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import type { PedidoItem } from "../../schemas/pedidoSchema";
import {
  crearPedido,
  obtenerPedido,
  obtenerProductos,
} from "../../api/api";

const servidor = setupServer();

beforeAll(() => servidor.listen({ onUnhandledRequest: "error" }));
afterEach(() => servidor.resetHandlers());
afterAll(() => servidor.close());

describe("obtenerProductos", () => {
  it("consulta el catálogo y devuelve productos validados", async () => {
    servidor.use(
      http.get("/productos", () =>
        HttpResponse.json([
          {
            id: 19,
            tipo: "pasteleria",
            nombre: "Muffin de chocolate",
            precio: 2500,
          },
        ]),
      ),
    );

    await expect(obtenerProductos()).resolves.toEqual([
      {
        id: 19,
        tipo: "pasteleria",
        nombre: "Muffin de chocolate",
        precio: 2500,
      },
    ]);
  });

  it("rechaza respuestas que no cumplen el esquema de productos", async () => {
    servidor.use(
      http.get("/productos", () =>
        HttpResponse.json([{ id: 19, tipo: "pasteleria" }]),
      ),
    );

    await expect(obtenerProductos()).rejects.toThrow();
  });
});

describe("crearPedido", () => {
  it("envía la mesa y los ítems, y valida la respuesta", async () => {
    let cuerpoRecibido: unknown;
    servidor.use(
      http.post("/pedidos", async ({ request }) => {
        cuerpoRecibido = await request.json();
        return HttpResponse.json(
          {
            id: 3,
            mesaId: 4,
            items: [{ productoId: 5, cantidad: 2 }],
            estado: "pendiente",
            total: 14720,
          },
          { status: 201 },
        );
      }),
    );

    const items: PedidoItem[] = [{ productoId: 5, cantidad: 2 }];
    await expect(crearPedido(4, items)).resolves.toMatchObject({
      id: 3,
      mesaId: 4,
      total: 14720,
    });
    expect(cuerpoRecibido).toEqual({ mesaId: 4, items });
  });

  it("propaga el mensaje de error devuelto por la API", async () => {
    servidor.use(
      http.post("/pedidos", () =>
        HttpResponse.json(
          { error: "Producto con ID 999 no encontrado" },
          { status: 400 },
        ),
      ),
    );

    await expect(
      crearPedido(undefined, [{ productoId: 999, cantidad: 1 }]),
    ).rejects.toThrow("Producto con ID 999 no encontrado");
  });
});

describe("obtenerPedido", () => {
  it("consulta y valida un pedido existente", async () => {
    servidor.use(
      http.get("/pedidos/3", () =>
        HttpResponse.json({
          id: 3,
          items: [{ productoId: 5, cantidad: 2 }],
          estado: "pendiente",
          total: 14720,
        }),
      ),
    );

    await expect(obtenerPedido(3)).resolves.toMatchObject({
      id: 3,
      estado: "pendiente",
      total: 14720,
    });
  });
});
