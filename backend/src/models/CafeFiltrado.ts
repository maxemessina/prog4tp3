import {
  calcularPrecioCafe,
  gramosPorTamanoFiltrado,
  type TamanoCafe,
  type VariedadCafe,
} from "./Cafe";
import { Producto } from "./Producto";

export class CafeFiltrado extends Producto {
  constructor(
    id: number,
    public readonly tamano: TamanoCafe,
    public readonly variedad: VariedadCafe,
  ) {
    super(id, `Café filtrado ${tamano} ${variedad}`, 3200);
  }

  override calcularPrecio(): number {
    return calcularPrecioCafe(
      this.precioBase,
      this.tamano,
      this.variedad,
      gramosPorTamanoFiltrado,
    );
  }
}
