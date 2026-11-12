import { describe, expect, it } from "vitest";
import { carritoInicial, carritoReducer } from "../../reducers/carritoReducers";

describe("carritoReducer", () => {
  it("inicia con el carrito vacío", () => {
    expect(carritoInicial).toEqual([]);
  });
});

  it("agrega un producto al carrito", () => {
    const producto = {
      id: 1,
      tipo: "pasteleria" as const,
      nombre: "Muffin de chocolate",
      precio: 2500,
    };

    const resultado = carritoReducer(carritoInicial, {
      type: "AGREGAR",
      producto,
    });

    expect(resultado).toEqual([
      {
        producto,
        cantidad: 1,
      },
    ]);
  });

