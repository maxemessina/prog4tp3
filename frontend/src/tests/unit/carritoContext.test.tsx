
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { Producto } from "../../schemas/productoSchema";
import { Carrito } from "../../components/carrito";
import {
  CarritoProvider,
  useCarrito,
} from "../../context/carritoContext";

const muffin: Producto = {
  id: 1,
  tipo: "pasteleria",
  nombre: "Muffin de chocolate",
  precio: 2500,
};

function AgregarProductoDePrueba({
  producto,
}: {
  producto: Producto;
}) {
  const { agregarProducto } = useCarrito();

  return (
    <button
      type="button"
      onClick={() => agregarProducto(producto)}
    >
      Agregar {producto.nombre}
    </button>
  );
}

function renderCarrito() {
  return render(
    <CarritoProvider>
      <AgregarProductoDePrueba producto={muffin} />
      <Carrito />
    </CarritoProvider>,
  );
}

describe("Carrito", () => {
  it("muestra un mensaje cuando el carrito está vacío", () => {
    renderCarrito();

    expect(
      screen.getByText("El carrito está vacío"),
    ).toBeInTheDocument();

    // La confirmación ahora pertenece a ConfirmacionPedido.
    // Carrito solamente muestra los productos.
    expect(
      screen.queryByRole("button", {
        name: /confirmar pedido/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("muestra un producto cuando se agrega al carrito", async () => {
    const user = userEvent.setup();

    renderCarrito();

    await user.click(
      screen.getByRole("button", {
        name: "Agregar Muffin de chocolate",
      }),
    );

    expect(
      screen.getByText("Muffin de chocolate"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Cantidad: 1"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Subtotal:.*2\.500/),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Total:.*2\.500/),
    ).toBeInTheDocument();
  });

  it("aumenta y disminuye la cantidad de un producto", async () => {
    const user = userEvent.setup();

    renderCarrito();

    await user.click(
      screen.getByRole("button", {
        name: "Agregar Muffin de chocolate",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Aumentar cantidad de Muffin de chocolate",
      }),
    );

    expect(
      screen.getByText("Cantidad: 2"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Subtotal:.*5\.000/),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Total:.*5\.000/),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Disminuir cantidad de Muffin de chocolate",
      }),
    );

    expect(
      screen.getByText("Cantidad: 1"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Subtotal:.*2\.500/),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Total:.*2\.500/),
    ).toBeInTheDocument();
  });

  it("elimina un producto cuando se presiona el botón quitar", async () => {
    const user = userEvent.setup();

    renderCarrito();

    await user.click(
      screen.getByRole("button", {
        name: "Agregar Muffin de chocolate",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Quitar Muffin de chocolate",
      }),
    );

    expect(
      screen.getByText("El carrito está vacío"),
    ).toBeInTheDocument();
  });

  it("elimina el producto cuando su cantidad llega a cero", async () => {
    const user = userEvent.setup();

    renderCarrito();

    await user.click(
      screen.getByRole("button", {
        name: "Agregar Muffin de chocolate",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Disminuir cantidad de Muffin de chocolate",
      }),
    );

    expect(
      screen.getByText("El carrito está vacío"),
    ).toBeInTheDocument();
  });
});
