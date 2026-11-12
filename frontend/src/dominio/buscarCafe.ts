import type { Cafe } from "../schemas/productoSchema";

export function buscarCafe(
  cafes: Cafe[],
  tipo: Cafe["tipo"],
  tamanio: Cafe["tamanio"],
  variedad: Cafe["variedad"]["nombre"],
): Cafe | undefined {
  return cafes.find(
  (cafe) =>
    cafe.tipo === tipo &&
    cafe.tamanio === tamanio &&
    cafe.variedad.nombre === variedad,
);
}