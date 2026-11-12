
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ResumenPedido } from "../../components/ResumenPedido";

describe("ResumenPedido", () => {
  it("muestra el ID, estado y total del pedido confirmado", () => {
    const pedido = {
      id: 3,
      mesaId: 4,
      items: [
        { productoId: 5, cantidad: 2 },
      ],
      estado: "pendiente",
      total: 14720,
    };

    render(<ResumenPedido pedido={pedido} />);

    expect(
      screen.getByText("Pedido #3"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Estado: pendiente"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Total: $ 14.720"),
    ).toBeInTheDocument();
  });

  it("actualiza el estado del pedido sin recargar la pagina", async () => {
    const user = userEvent.setup();

    const pedido = {
      id: 3,
      mesaId: 4,
      items: [
        { productoId: 5, cantidad: 2 },
      ],
      estado: "pendiente",
      total: 14720,
    };

    const pedidoActualizado = {
      ...pedido,
      estado: "en preparación",
    };

    const obtenerPedido = vi.fn().mockResolvedValue(pedidoActualizado);

    render(
      <ResumenPedido
        pedido={pedido}
        obtenerPedido={obtenerPedido}
      />,
    );

    expect(
      screen.getByText("Estado: pendiente"),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Actualizar estado" }),
    );

    expect(obtenerPedido).toHaveBeenCalledWith(3);

    expect(
      await screen.findByText("Estado: en preparación"),
    ).toBeInTheDocument();
  });
});
