
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { crearPedido } from "../../api/api";
import { confirmarPedido } from "../../pedidos/confirmarPedido";

const servidor = setupServer();

beforeAll(() => {
  servidor.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  servidor.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  servidor.close();
});

describe("confirmarPedido con API real simulada", () => {
  it("envia el pedido y vacia el carrito cuando la API responde correctamente", async () => {
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

    const items = [{ productoId: 5, cantidad: 2 }];
    const vaciarCarrito = vi.fn();

    const resultado = await confirmarPedido(
      4,
      items,
      crearPedido,
      vaciarCarrito,
    );

    expect(cuerpoRecibido).toEqual({
      mesaId: 4,
      items,
    });

    expect(resultado.id).toBe(3);
    expect(resultado.estado).toBe("pendiente");
    expect(resultado.total).toBe(14720);

    expect(vaciarCarrito).toHaveBeenCalledTimes(1);
  });

  it("conserva el carrito cuando la API devuelve un error", async () => {
    servidor.use(
      http.post("/pedidos", () => {
        return HttpResponse.json(
          { error: "No se pudo registrar el pedido" },
          { status: 400 },
        );
      }),
    );

    const items = [{ productoId: 5, cantidad: 2 }];
    const vaciarCarrito = vi.fn();

    await expect(
      confirmarPedido(
        4,
        items,
        crearPedido,
        vaciarCarrito,
      ),
    ).rejects.toThrow("No se pudo registrar el pedido");

    expect(vaciarCarrito).not.toHaveBeenCalled();
  });
});
