
import { useState } from "react";
import type { Pedido } from "../schemas/pedidoSchema";
import { formatearPrecio } from "../dominio/formatearPrecio";
import { actualizarPedido } from "../pedidos/actualizarPedido";

type ResumenPedidoProps = {
  pedido: Pedido;
  obtenerPedido?: (id: number) => Promise<Pedido>;
};

export function ResumenPedido({
  pedido,
  obtenerPedido,
}: ResumenPedidoProps) {
  const [pedidoActual, setPedidoActual] = useState<Pedido>(pedido);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function manejarActualizacion() {
    if (!obtenerPedido || actualizando) {
      return;
    }

    setActualizando(true);
    setError(null);

    try {
      const resultado = await actualizarPedido(
        pedidoActual.id,
        obtenerPedido,
      );

      setPedidoActual(resultado);
    } catch {
      setError("No se pudo actualizar el estado del pedido.");
    } finally {
      setActualizando(false);
    }
  }

  return (
    <section>
      <h2>Pedido #{pedidoActual.id}</h2>

      <p>Estado: {pedidoActual.estado}</p>

      <p>Total: {formatearPrecio(pedidoActual.total)}</p>

      {obtenerPedido && (
        <button
          type="button"
          onClick={manejarActualizacion}
          disabled={actualizando}
        >
          {actualizando ? "Actualizando..." : "Actualizar estado"}
        </button>
      )}

      {error && <p role="alert">{error}</p>}
    </section>
  );
}
