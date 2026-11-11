import {
  calcularPrecioCafe,
  gramosPorTamanoExpreso,
  type TamanoCafe,
  type VariedadCafe,
} from "./Cafe";
import { Producto } from "./Producto";

export class CafeExpreso extends Producto {
  constructor(
    id: number,
    public readonly tamano: TamanoCafe,
    public readonly variedad: VariedadCafe,
  ) {
    super(id, `Café expreso ${tamano} ${variedad}`, 2500);
  }

  override calcularPrecio(): number {
    return calcularPrecioCafe(
      this.precioBase,
      this.tamano,
      this.variedad,
      gramosPorTamanoExpreso,
    );
  }
}
