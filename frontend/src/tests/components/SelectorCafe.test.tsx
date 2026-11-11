
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SelectorCafe from "../../components/SelectorCafe";
import type { Cafe } from "../../schemas/productoSchema";

const cafes: Cafe[] = [
  {
    id: 1,
    tipo: "expreso",
    nombre: "Café expreso Mediano Colombia",
    tamanio: "Mediano",
    gramosCafe: 27,
    variedad: {
      nombre: "Colombia",
      descripcion:
        "Acidez media, cuerpo equilibrado y notas cítricas y florales",
    },
    precio: 7360,
  },
];

describe("SelectorCafe", () => {
  it("habilita agregar únicamente cuando se completan las tres selecciones", async () => {
    const user = userEvent.setup();

    render(<SelectorCafe cafes={cafes} onAgregar={vi.fn()} />);

    const botonAgregar = screen.getByRole("button", {
      name: /agregar café/i,
    });

    expect(botonAgregar).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Expreso" }));
    await user.click(screen.getByRole("button", { name: "Mediano" }));

    expect(botonAgregar).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Colombia" }));

    expect(botonAgregar).toBeEnabled();
  });

  it("agrega el café que coincide con las selecciones", async () => {
    const user = userEvent.setup();
    const onAgregar = vi.fn();

    render(<SelectorCafe cafes={cafes} onAgregar={onAgregar} />);

    await user.click(screen.getByRole("button", { name: "Expreso" }));
    await user.click(screen.getByRole("button", { name: "Mediano" }));
    await user.click(screen.getByRole("button", { name: "Colombia" }));

    await user.click(screen.getByRole("button", { name: /agregar café/i }));

    expect(onAgregar).toHaveBeenCalledWith(cafes[0]);
  });

});
