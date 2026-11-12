
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
      screen.getByText("pendiente"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Total: $ 14.720"),
    ).toBeInTheDocument();
  });
});
