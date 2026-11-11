import type { Pedido, PedidoConTotal, PedidoItem } from "../models/Pedido";
import type { Producto } from "../models/Producto";

interface ProductoLookup {
  obtenerProductoPorId(id: number): Producto | undefined;
}

export class PedidoService {
  private readonly pedidos: Pedido[] = [];
  private siguienteId = 1;

  constructor(private readonly productos: ProductoLookup) {}

  crearPedido(items: PedidoItem[]): PedidoConTotal {
    const total = this.calcularTotalItems(items);

    const pedido: Pedido = {
      id: this.siguienteId++,
      items: items.map((item) => ({ ...item })),
      estado: "pendiente",
    };

    this.pedidos.push(pedido);

    return {
      ...this.copiarPedido(pedido),
      total,
    };
  }

  listarPedidos(): Pedido[] {
    return this.pedidos.map((pedido) => this.copiarPedido(pedido));
  }

  obtenerPedidoPorId(id: number): Pedido | undefined {
    const pedido = this.pedidos.find((pedido) => pedido.id === id);

    return pedido ? this.copiarPedido(pedido) : undefined;
  }

  calcularFacturacionTotal(): number {
    return this.pedidos.reduce(
      (total, pedido) => total + this.calcularTotalPedido(pedido),
      0,
    );
  }

  calcularUnidadesVendidas(): Record<string, number> {
    return this.pedidos.reduce<Record<string, number>>((ventas, pedido) => {
      for (const item of pedido.items) {
        const producto = this.obtenerProducto(item.productoId);
        ventas[producto.nombre] = (ventas[producto.nombre] ?? 0) + item.cantidad;
      }

      return ventas;
    }, {});
  }

  obtenerProductoMasVendido():
    | { producto: string; cantidad: number }
    | undefined {
    const unidadesVendidas = this.calcularUnidadesVendidas();
    let masVendido: { producto: string; cantidad: number } | undefined;

    for (const [producto, cantidad] of Object.entries(unidadesVendidas)) {
      if (!masVendido || cantidad > masVendido.cantidad) {
        masVendido = { producto, cantidad };
      }
    }

    return masVendido;
  }

  private calcularTotalPedido(pedido: Pedido): number {
    return this.calcularTotalItems(pedido.items);
  }

  private calcularTotalItems(items: PedidoItem[]): number {
    return items.reduce((total, item) => {
      const producto = this.obtenerProducto(item.productoId);
      return total + producto.calcularPrecio() * item.cantidad;
    }, 0);
  }

  private obtenerProducto(productoId: number): Producto {
    const producto = this.productos.obtenerProductoPorId(productoId);

    if (!producto) {
      throw new Error(`Producto con ID ${productoId} no encontrado`);
    }

    return producto;
  }

  private copiarPedido(pedido: Pedido): Pedido {
    return {
      ...pedido,
      items: pedido.items.map((item) => ({ ...item })),
    };
  }
}