
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TarjetaPasteleria from "../../components/TarjetaPasteleria";
import type { Pasteleria } from "../../schemas/productoSchema";

const producto: Pasteleria = {
  id: 10,
  tipo: "pasteleria",
  nombre: "Muffin de chocolate",
  precio: 2500,
};

describe("TarjetaPasteleria", () => {
  it("muestra el nombre y el precio del producto", () => {
    render(
      <TarjetaPasteleria
        producto={producto}
        onAgregar={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Muffin de chocolate"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("$ 2.500"),
    ).toBeInTheDocument();
  });

  it("llama a onAgregar con el producto al hacer clic", async () => {
    const user = userEvent.setup();
    const onAgregar = vi.fn();

    render(
      <TarjetaPasteleria
        producto={producto}
        onAgregar={onAgregar}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(onAgregar).toHaveBeenCalledWith(producto);
  });
});

