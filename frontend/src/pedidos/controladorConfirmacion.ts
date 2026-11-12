
import type { Pedido, PedidoItem } from "../schemas/pedidoSchema";
import { confirmarPedido } from "./confirmarPedido";

type CrearPedido = (
  mesaId: number | undefined,
  items: PedidoItem[],
) => Promise<Pedido>;

export function crearControladorConfirmacion(
  crearPedido: CrearPedido,
  vaciarCarrito: () => void,
) {
  let pedidoEnProceso: Promise<Pedido> | null = null;

  return {
    confirmar(
      mesaId: number | undefined,
      items: PedidoItem[],
    ): Promise<Pedido> {
      if (pedidoEnProceso) {
        return pedidoEnProceso;
      }

      const solicitud = confirmarPedido(
        mesaId,
        items,
        crearPedido,
        vaciarCarrito,
      );

      pedidoEnProceso = solicitud;

      void solicitud.finally(() => {
        pedidoEnProceso = null;
      }).catch(() => {
        // La promesa original comunica el error.
      });

      return solicitud;
    },
  };
}
