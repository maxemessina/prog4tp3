
import { describe, expect, it, vi } from "vitest";
import { actualizarPedido } from "../../pedidos/actualizarPedido";

describe("actualizarPedido", () => {
  it("consulta el pedido por su ID y devuelve el estado actualizado", async () => {
    const pedidoActualizado = {
      id: 3,
      mesaId: 4,
      items: [{ productoId: 5, cantidad: 2 }],
      estado: "en preparación",
      total: 14720,
    };

    const obtenerPedido = vi.fn().mockResolvedValue(pedidoActualizado);

    const resultado = await actualizarPedido(3, obtenerPedido);

    expect(obtenerPedido).toHaveBeenCalledTimes(1);
    expect(obtenerPedido).toHaveBeenCalledWith(3);
    expect(resultado).toEqual(pedidoActualizado);
    expect(resultado.estado).toBe("en preparación");
  });
});
