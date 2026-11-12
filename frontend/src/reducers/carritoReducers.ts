
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
  | { type: "QUITAR"; productoId: number };

export function carritoReducer(
  estado: EstadoCarrito,
  accion: AccionCarrito,
): EstadoCarrito {
  switch (accion.type) {
    case "AGREGAR":
      return estado;

    case "SUMAR":
      return estado;

    case "RESTAR":
      return estado;

    case "QUITAR":
      return estado;

    default:
      return estado;
  }
}
