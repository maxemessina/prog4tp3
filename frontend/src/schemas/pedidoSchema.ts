import { z } from "zod";

const pedidoItemSchema = z.object({
  productoId: z.number().int().positive(),
  cantidad: z.number().int().positive(),
});

export const pedidoSchema = z.object({
  id: z.number().int().positive(),
  mesaId: z.number().int().positive().optional(),
  items: z.array(pedidoItemSchema).min(1),
  estado: z.string().min(1),
  total: z.number().nonnegative(),
});

export const pedidoCreadoSchema = pedidoSchema;

export type PedidoItem = z.infer<typeof pedidoItemSchema>;
export type Pedido = z.infer<typeof pedidoSchema>;
