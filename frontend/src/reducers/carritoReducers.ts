
import type { Producto } from "../schemas/productoSchema";

export type ItemCarrito = {
  producto: Producto;
  cantidad: number;
};

export type EstadoCarrito = ItemCarrito[];

export const carritoInicial: EstadoCarrito = [];

export type AccionCarrito =
  | { type: "AGREGAR"; producto: Producto }
  | { type: "SUMAR"; productoId: number }
  | { type: "RESTAR"; productoId: number }
  | { type: "QUITAR"; productoId: number }
  | { type: "VACIAR" };

export function carritoReducer(
  estado: EstadoCarrito,
  accion: AccionCarrito,
): EstadoCarrito {
  switch (accion.type) {
    case "AGREGAR": {
      const itemExistente = estado.find(
        (item) => item.producto.id === accion.producto.id,
      );

      if (itemExistente) {
        return estado.map((item) =>
          item.producto.id === accion.producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }

      return [...estado, { producto: accion.producto, cantidad: 1 }];
    }

    case "SUMAR":
      return estado.map((item) =>
        item.producto.id === accion.productoId
          ? { ...item, cantidad: item.cantidad + 1 }
          : item,
      );

    case "RESTAR":
      return estado
        .map((item) =>
          item.producto.id === accion.productoId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item,
        )
        .filter((item) => item.cantidad > 0);

    case "QUITAR":
      return estado.filter(
        (item) => item.producto.id !== accion.productoId,
      );

    case "VACIAR":
      return carritoInicial;

    default:
      return estado;
  }
}

export function calcularSubtotalItem(item: ItemCarrito): number {
  return item.producto.precio * item.cantidad;
}

export function calcularSubtotalCarrito(
  estado: EstadoCarrito,
): number {
  return estado.reduce(
    (total, item) => total + calcularSubtotalItem(item),
    0,
  );
}
