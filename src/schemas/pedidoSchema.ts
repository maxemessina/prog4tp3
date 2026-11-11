import { z } from "zod";
//Valida que producto Id debe ser un numero entero positivo
//la cantidad debe serun numero entero positivo. no admite cero, negativos o decimales
//y debe ser un array con almenos 1 producto
export const pedidoSchema = z.object({
 items: z
    .array(
      z.object({
        productoId: z.number().int().positive(),
        cantidad: z.number().int().positive(),
     }),
    )
    .min(1, "El pedido debe contener al menos un producto"),
});