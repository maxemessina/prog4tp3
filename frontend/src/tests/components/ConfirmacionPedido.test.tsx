
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConfirmacionPedido } from "../../components/ConfirmacionPedido";

describe("ConfirmacionPedido", () => {
  it("confirma los productos seleccionados y muestra el resumen", async () => {
    const user = userEvent.setup();

    const items = [
      { productoId: 5, cantidad: 2 },
    ];

    const pedidoConfirmado = {
      id: 3,
      mesaId: 4,
      items,
      estado: "pendiente",
      total: 14720,
    };

    const crearPedido = vi.fn().mockResolvedValue(pedidoConfirmado);
    const obtenerPedido = vi.fn().mockResolvedValue(pedidoConfirmado);
    const vaciarCarrito = vi.fn();

    render(
      <ConfirmacionPedido
        mesaId={4}
        items={items}
        crearPedido={crearPedido}
        obtenerPedido={obtenerPedido}
        vaciarCarrito={vaciarCarrito}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Confirmar pedido" }),
    );

    expect(crearPedido).toHaveBeenCalledWith(4, items);
    expect(vaciarCarrito).toHaveBeenCalledTimes(1);

    expect(
      await screen.findByText("Pedido #3"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Estado: pendiente"),
    ).toBeInTheDocument();
  });

  it("muestra el error, conserva el carrito y permite reintentar", async () => {
    const user = userEvent.setup();

    const items = [
      { productoId: 5, cantidad: 2 },
    ];

    const pedidoConfirmado = {
      id: 3,
      mesaId: 4,
      items,
      estado: "pendiente",
      total: 14720,
    };

    const crearPedido = vi
      .fn()
      .mockRejectedValueOnce(new Error("Error al confirmar el pedido"))
      .mockResolvedValueOnce(pedidoConfirmado);

    const obtenerPedido = vi.fn().mockResolvedValue(pedidoConfirmado);
    const vaciarCarrito = vi.fn();

    render(
      <ConfirmacionPedido
        mesaId={4}
        items={items}
        crearPedido={crearPedido}
        obtenerPedido={obtenerPedido}
        vaciarCarrito={vaciarCarrito}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Confirmar pedido" }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("Error al confirmar el pedido");

    expect(vaciarCarrito).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole("button", { name: "Confirmar pedido" }),
    );

    expect(
      await screen.findByText("Pedido #3"),
    ).toBeInTheDocument();

    expect(crearPedido).toHaveBeenCalledTimes(2);
    expect(vaciarCarrito).toHaveBeenCalledTimes(1);
  });
});
