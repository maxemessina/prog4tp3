
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { obtenerPedido } from "../../api/api";
import { actualizarPedido } from "../../pedidos/actualizarPedido";

const servidor = setupServer();

beforeAll(() => {
  servidor.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  servidor.resetHandlers();
});

afterAll(() => {
  servidor.close();
});

describe("actualizarPedido con MSW", () => {
  it("consulta el pedido por su ID y devuelve su estado actualizado", async () => {
    let idConsultado: string | undefined;

    servidor.use(
      http.get("/pedidos/:id", ({ params }) => {
        idConsultado = String(params.id);

        return HttpResponse.json({
          id: 3,
          mesaId: 4,
          items: [{ productoId: 5, cantidad: 2 }],
          estado: "en preparación",
          total: 14720,
        });
      }),
    );

    const resultado = await actualizarPedido(3, obtenerPedido);

    expect(idConsultado).toBe("3");
    expect(resultado.id).toBe(3);
    expect(resultado.estado).toBe("en preparación");
    expect(resultado.total).toBe(14720);
  });

  it("comunica un error cuando no se encuentra el pedido", async () => {
    servidor.use(
      http.get("/pedidos/:id", () => {
        return HttpResponse.json(
          { error: "Pedido no encontrado" },
          { status: 404 },
        );
      }),
    );

    await expect(
      actualizarPedido(99, obtenerPedido),
    ).rejects.toThrow("Pedido no encontrado");
  });
});
