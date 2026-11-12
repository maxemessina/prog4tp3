import { z } from "zod";
import {
  pedidoCreadoSchema,
  pedidoSchema,
  type Pedido,
  type PedidoItem,
} from "../schemas/pedidoSchema";
import {
  productosSchema,
  type Producto,
} from "../schemas/productoSchema";

const errorApiSchema = z.object({
  error: z.string().min(1),
});

async function solicitar(
  ruta: string,
  opciones?: RequestInit,
): Promise<unknown> {
  const respuesta = await fetch(new URL(ruta, window.location.origin), opciones);
  const cuerpo: unknown = await respuesta.json();

  if (!respuesta.ok) {
    const errorApi = errorApiSchema.safeParse(cuerpo);
    throw new Error(
      errorApi.success
        ? errorApi.data.error
        : `La API respondió con el estado ${respuesta.status}.`,
    );
  }

  return cuerpo;
}

export async function obtenerProductos(): Promise<Producto[]> {
  const respuesta = await solicitar("/productos");
  return productosSchema.parse(respuesta);
}

export async function crearPedido(
  mesaId: number | undefined,
  items: PedidoItem[],
): Promise<Pedido> {
  const cuerpo = {
    ...(mesaId === undefined ? {} : { mesaId }),
    items,
  };
  const respuesta = await solicitar("/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  });

  return pedidoCreadoSchema.parse(respuesta);
}

export async function obtenerPedido(id: number): Promise<Pedido> {
  const respuesta = await solicitar(`/pedidos/${id}`);
  return pedidoSchema.parse(respuesta);
}
