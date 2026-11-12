
import type { Pedido, PedidoItem } from "../schemas/pedidoSchema";

type CrearPedido = (
  mesaId: number | undefined,
  items: PedidoItem[],
) => Promise<Pedido>;

export async function confirmarPedido(
  mesaId: number | undefined,
  items: PedidoItem[],
  crearPedido: CrearPedido,
  vaciarCarrito: () => void,
): Promise<Pedido> {
  const pedido = await crearPedido(mesaId, items);

  vaciarCarrito();

  return pedido;
}
