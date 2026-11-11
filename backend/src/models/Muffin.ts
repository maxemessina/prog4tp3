import { Producto } from "./Producto";

export class Muffin extends Producto {
  constructor(id: number) {
    super(id, "Muffin de chocolate", 2500);
  }

  override calcularPrecio(): number {
    return this.precioBase;
  }
}