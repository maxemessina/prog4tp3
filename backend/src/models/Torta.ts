import { Producto } from "./Producto";

export class TortaSelvaNegra extends Producto {
  constructor(id: number) {
    super(id, "Porción de torta selva negra", 4200);
  }

  override calcularPrecio(): number {
    return this.precioBase;
  }
}