
import { describe, expect, it } from "vitest";
import {
  carritoInicial,
  carritoReducer,
  calcularSubtotalItem,
  calcularSubtotalCarrito,
} from "../../reducers/carritoReducers";

describe("carritoReducer", () => {
  it("inicia con el carrito vacío", () => {
    expect(carritoInicial).toEqual([]);
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

  it("acumula la cantidad si el producto ya existe", () => {
    const producto = {
      id: 1,
      tipo: "pasteleria" as const,
      nombre: "Muffin de chocolate",
      precio: 2500,
    };

    const primerResultado = carritoReducer(carritoInicial, {
      type: "AGREGAR",
      producto,
    });

    const segundoResultado = carritoReducer(primerResultado, {
      type: "AGREGAR",
      producto,
    });

    expect(segundoResultado).toEqual([
      {
        producto,
        cantidad: 2,
      },
    ]);
  });

  it("aumenta en uno la cantidad de un producto", () => {
    const producto = {
      id: 1,
      tipo: "pasteleria" as const,
      nombre: "Muffin de chocolate",
      precio: 2500,
    };

    const estadoConProducto = carritoReducer(carritoInicial, {
      type: "AGREGAR",
      producto,
    });

    const resultado = carritoReducer(estadoConProducto, {
      type: "SUMAR",
      productoId: 1,
    });

    expect(resultado).toEqual([
      {
        producto,
        cantidad: 2,
      },
    ]);
  });

  it("disminuye en uno la cantidad de un producto", () => {
    const producto = {
      id: 1,
      tipo: "pasteleria" as const,
      nombre: "Muffin de chocolate",
      precio: 2500,
    };

    const estadoInicial = [
      {
        producto,
        cantidad: 2,
      },
    ];

    const resultado = carritoReducer(estadoInicial, {
      type: "RESTAR",
      productoId: 1,
    });

    expect(resultado).toEqual([
      {
        producto,
        cantidad: 1,
      },
    ]);
  });

  it("elimina el producto cuando su cantidad llega a cero", () => {
    const producto = {
      id: 1,
      tipo: "pasteleria" as const,
      nombre: "Muffin de chocolate",
      precio: 2500,
    };

    const estadoInicial = [
      {
        producto,
        cantidad: 1,
      },
    ];

    const resultado = carritoReducer(estadoInicial, {
      type: "RESTAR",
      productoId: 1,
    });

    expect(resultado).toEqual([]);
  });

  it("elimina un producto del carrito", () => {
    const producto1 = {
      id: 1,
      tipo: "pasteleria" as const,
      nombre: "Muffin de chocolate",
      precio: 2500,
    };

    const producto2 = {
      id: 2,
      tipo: "pasteleria" as const,
      nombre: "Torta selva negra",
      precio: 4200,
    };

    const estadoInicial = [
      { producto: producto1, cantidad: 2 },
      { producto: producto2, cantidad: 1 },
    ];

    const resultado = carritoReducer(estadoInicial, {
      type: "QUITAR",
      productoId: 1,
    });

    expect(resultado).toEqual([
      { producto: producto2, cantidad: 1 },
    ]);
  });

  it("no modifica el carrito si intenta sumar un producto inexistente", () => {
    const resultado = carritoReducer(carritoInicial, {
      type: "SUMAR",
      productoId: 999,
    });

    expect(resultado).toEqual([]);
  });

  it("calcula el subtotal de un producto", () => {
    const producto = {
      id: 1,
      tipo: "pasteleria" as const,
      nombre: "Muffin de chocolate",
      precio: 2500,
    };

    const estado = [
      { producto, cantidad: 2 },
    ];

    expect(calcularSubtotalItem(estado[0])).toBe(5000);
  });

  it("calcula el subtotal general del carrito", () => {
    const producto1 = {
      id: 1,
      tipo: "pasteleria" as const,
      nombre: "Muffin de chocolate",
      precio: 2500,
    };

    const producto2 = {
      id: 2,
      tipo: "pasteleria" as const,
      nombre: "Torta selva negra",
      precio: 4200,
    };

    const estado = [
      { producto: producto1, cantidad: 2 },
      { producto: producto2, cantidad: 1 },
    ];

    expect(calcularSubtotalCarrito(estado)).toBe(9200);
  });

  it("calcula cero cuando el carrito está vacío", () => {
    expect(calcularSubtotalCarrito(carritoInicial)).toBe(0);
  });

  // NUEVO TEST: integración de confirmación de pedidos
  it("vacía todos los productos del carrito", () => {
    const producto1 = {
      id: 1,
      tipo: "pasteleria" as const,
      nombre: "Muffin de chocolate",
      precio: 2500,
    };

    const producto2 = {
      id: 2,
      tipo: "pasteleria" as const,
      nombre: "Torta selva negra",
      precio: 4200,
    };

    const estadoInicial = [
      { producto: producto1, cantidad: 2 },
      { producto: producto2, cantidad: 1 },
    ];

    const resultado = carritoReducer(estadoInicial, {
      type: "VACIAR",
    });

    expect(resultado).toEqual([]);
  });
});
