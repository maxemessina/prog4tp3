import { z } from "zod";

const variedadCafeSchema = z.object({
  nombre: z.enum(["Brasil", "Colombia", "Etiopía"]),
  descripcion: z.string().min(1),
});

const cafeSchema = z.object({
  id: z.number().int().positive(),
  tipo: z.enum(["expreso", "filtrado"]),
  nombre: z.string().min(1),
  tamanio: z.enum(["Pocillo", "Mediano", "Taza grande"]),
  gramosCafe: z.number().positive(),
  variedad: variedadCafeSchema,
  precio: z.number().nonnegative(),
});

const pasteleriaSchema = z.object({
  id: z.number().int().positive(),
  tipo: z.literal("pasteleria"),
  nombre: z.string().min(1),
  precio: z.number().nonnegative(),
});

export const productoSchema = z.discriminatedUnion("tipo", [
  cafeSchema,
  pasteleriaSchema,
]);

export const productosSchema = z.array(productoSchema);

export type Producto = z.infer<typeof productoSchema>;
export type Cafe = z.infer<typeof cafeSchema>;
export type Pasteleria = z.infer<typeof pasteleriaSchema>;
