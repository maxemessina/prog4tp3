
import { CafeExpreso } from "../models/CafeExpreso";
import { CafeFiltrado } from "../models/CafeFiltrado";
import { Muffin } from "../models/Muffin";
import { TortaSelvaNegra } from "../models/Torta";
import type { Producto } from "../models/Producto";
import type { TamanoCafe, VariedadCafe } from "../models/Cafe";

const tamanos: TamanoCafe[] = [
  "Pocillo",
  "Mediano",
  "Taza grande",
];

const variedades: VariedadCafe[] = [
  "Brasil",
  "Colombia",
  "Etiopía",
];

const productos: Producto[] = [];

let siguienteId = 1;

for (const tamano of tamanos) {
  for (const variedad of variedades) {
    productos.push(new CafeExpreso(siguienteId++, tamano, variedad));
  }
}

for (const tamano of tamanos) {
  for (const variedad of variedades) {
    productos.push(new CafeFiltrado(siguienteId++, tamano, variedad));
  }
}

productos.push(new Muffin(siguienteId++));
productos.push(new TortaSelvaNegra(siguienteId++));

export function listarProductos(): Producto[] {
  return productos;
}
export function obtenerProductoPorId(id: number): Producto | undefined {
  return productos.find((producto) => producto.id === id);
}
