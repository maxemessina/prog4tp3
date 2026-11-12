
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
      return estado;

    case "RESTAR":
      return estado;

    case "QUITAR":
      return estado;

    default:
      return estado;
  }
}
