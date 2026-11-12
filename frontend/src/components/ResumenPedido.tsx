
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
  const [mensaje, setMensaje] = useState<string | null>(null);

  async function manejarActualizacion() {
    if (!obtenerPedido || actualizando) {
      return;
    }

    setActualizando(true);
    setError(null);
    setMensaje(null);

    try {
      const resultado = await actualizarPedido(
        pedidoActual.id,
        obtenerPedido,
      );

      setPedidoActual(resultado);

      if (resultado.estado === pedidoActual.estado) {
        setMensaje(
          `Estado consultado correctamente. El pedido continúa ${resultado.estado}.`,
        );
      } else {
        setMensaje(
          `El estado del pedido cambió a ${resultado.estado}.`,
        );
      }
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

      {mensaje && (
        <p role="status">{mensaje}</p>
      )}

      {error && (
        <p role="alert">{error}</p>
      )}
    </section>
  );
}
