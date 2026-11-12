
import { describe, expect, it, vi } from "vitest";
import { confirmarPedido } from "../../pedidos/confirmarPedido";

describe("confirmarPedido", () => {
  it("vacía el carrito únicamente cuando la API confirma el pedido", async () => {
    const items = [{ productoId: 5, cantidad: 2 }];

    const pedidoCreado = {
      id: 3,
      mesaId: 4,
      items,
      estado: "pendiente",
      total: 14720,
    };

    const crearPedido = vi.fn().mockResolvedValue(pedidoCreado);
    const vaciarCarrito = vi.fn();

    const resultado = await confirmarPedido(
      4,
      items,
      crearPedido,
      vaciarCarrito,
    );

    expect(crearPedido).toHaveBeenCalledWith(4, items);
    expect(vaciarCarrito).toHaveBeenCalledOnce();
    expect(resultado).toEqual(pedidoCreado);
  });
});
