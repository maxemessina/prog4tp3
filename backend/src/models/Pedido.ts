export interface PedidoItem {
  productoId: number;
  cantidad: number;
}

export interface Pedido {
  id: number;
  mesaId?: number;
  items: PedidoItem[];
  estado: string;
}

export interface PedidoConTotal extends Pedido {
  total: number;
}