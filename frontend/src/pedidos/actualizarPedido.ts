
import type { Pedido } from "../schemas/pedidoSchema";

type ObtenerPedido = (id: number) => Promise<Pedido>;

export async function actualizarPedido(
  id: number,
  obtenerPedido: ObtenerPedido,
): Promise<Pedido> {
  return await obtenerPedido(id);
}
