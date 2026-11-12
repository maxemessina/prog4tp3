
import { useRef, useState } from "react";
import type { Pedido, PedidoItem } from "../schemas/pedidoSchema";
import { crearControladorConfirmacion } from "../pedidos/controladorConfirmacion";
import { ResumenPedido } from "./ResumenPedido";

type ConfirmacionPedidoProps = {
  mesaId: number | undefined;
  items: PedidoItem[];
  crearPedido: (
    mesaId: number | undefined,
    items: PedidoItem[],
  ) => Promise<Pedido>;
  obtenerPedido: (id: number) => Promise<Pedido>;
  vaciarCarrito: () => void;
};

export function ConfirmacionPedido({
  mesaId,
  items,
  crearPedido,
  obtenerPedido,
  vaciarCarrito,
}: ConfirmacionPedidoProps) {
  const [pedidoConfirmado, setPedidoConfirmado] = useState<Pedido | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dependencias = useRef({
    crearPedido,
    vaciarCarrito,
  });

  dependencias.current = {
    crearPedido,
    vaciarCarrito,
  };

  const controladorRef = useRef(
    crearControladorConfirmacion(
      (mesa, productos) =>
        dependencias.current.crearPedido(mesa, productos),
      () => dependencias.current.vaciarCarrito(),
    ),
  );

  async function manejarConfirmacion() {
    if (confirmando || items.length === 0) {
      return;
    }

    setConfirmando(true);
    setError(null);

    try {
      const pedido = await controladorRef.current.confirmar(
        mesaId,
        items,
      );

      setPedidoConfirmado(pedido);
    } catch (errorDesconocido) {
      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "No se pudo confirmar el pedido.",
      );
    } finally {
      setConfirmando(false);
    }
  }

  if (pedidoConfirmado) {
    return (
      <ResumenPedido
        pedido={pedidoConfirmado}
        obtenerPedido={obtenerPedido}
      />
    );
  }

  return (
    <section>
      <button
        type="button"
        onClick={manejarConfirmacion}
        disabled={confirmando || items.length === 0}
      >
        {confirmando ? "Confirmando..." : "Confirmar pedido"}
      </button>

      {error && <p role="alert">{error}</p>}
    </section>
  );
}
