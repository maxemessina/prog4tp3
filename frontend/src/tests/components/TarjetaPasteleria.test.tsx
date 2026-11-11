
import { render, screen } from "@testing-library/react";
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
});
