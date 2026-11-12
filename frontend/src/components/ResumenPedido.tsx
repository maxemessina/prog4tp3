
import type { Pedido } from "../schemas/pedidoSchema";
import { formatearPrecio } from "../dominio/formatearPrecio";

type ResumenPedidoProps = {
  pedido: Pedido;
};

export function ResumenPedido({ pedido }: ResumenPedidoProps) {
  return (
    <section>
      <h2>Pedido #{pedido.id}</h2>

      <p>Estado: {pedido.estado}</p>

      <p>Total: {formatearPrecio(pedido.total)}</p>
    </section>
  );
}