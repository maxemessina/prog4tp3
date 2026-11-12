import type { Producto } from "../schemas/productoSchema";

export type EstadoMenu =
  | { estado: "cargando" }
  | { estado: "error"; mensaje: string }
  | { estado: "listo"; productos: Producto[] };

export const estadoCargando: EstadoMenu = { estado: "cargando" };

export function crearEstadoError(mensaje: string): EstadoMenu {
  return { estado: "error", mensaje };
}

export function crearEstadoListo(productos: Producto[]): EstadoMenu {
  return { estado: "listo", productos };
}
