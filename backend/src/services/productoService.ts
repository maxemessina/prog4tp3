
import { CafeExpreso } from "../models/CafeExpreso";
import { CafeFiltrado } from "../models/CafeFiltrado";
import { Muffin } from "../models/Muffin";
import { TortaSelvaNegra } from "../models/Torta";
import type { Producto } from "../models/Producto";
import {
  descripcionesVariedad,
  gramosPorTamanoExpreso,
  gramosPorTamanoFiltrado,
  type TamanoCafe,
  type VariedadCafe,
} from "../models/Cafe";

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

export type ProductoResponse =
  | {
      id: number;
      tipo: "expreso" | "filtrado";
      nombre: string;
      tamanio: TamanoCafe;
      gramosCafe: number;
      variedad: {
        nombre: VariedadCafe;
        descripcion: string;
      };
      precio: number;
    }
  | {
      id: number;
      tipo: "pasteleria";
      nombre: string;
      precio: number;
    };

export function serializarProducto(producto: Producto): ProductoResponse {
  if (producto instanceof CafeExpreso) {
    return {
      id: producto.id,
      tipo: "expreso",
      nombre: producto.nombre,
      tamanio: producto.tamano,
      gramosCafe: gramosPorTamanoExpreso[producto.tamano],
      variedad: {
        nombre: producto.variedad,
        descripcion: descripcionesVariedad[producto.variedad],
      },
      precio: producto.calcularPrecio(),
    };
  }

  if (producto instanceof CafeFiltrado) {
    return {
      id: producto.id,
      tipo: "filtrado",
      nombre: producto.nombre,
      tamanio: producto.tamano,
      gramosCafe: gramosPorTamanoFiltrado[producto.tamano],
      variedad: {
        nombre: producto.variedad,
        descripcion: descripcionesVariedad[producto.variedad],
      },
      precio: producto.calcularPrecio(),
    };
  }

  if (producto instanceof Muffin || producto instanceof TortaSelvaNegra) {
    return {
      id: producto.id,
      tipo: "pasteleria",
      nombre: producto.nombre,
      precio: producto.calcularPrecio(),
    };
  }

  throw new Error(`Tipo de producto no soportado: ${producto.constructor.name}`);
}
