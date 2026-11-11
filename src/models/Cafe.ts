export type TamanoCafe = "Pocillo" | "Mediano" | "Taza grande";
export type VariedadCafe = "Brasil" | "Colombia" | "Etiopía";

export const gramosPorTamanoExpreso: Record<TamanoCafe, number> = {
  Pocillo: 18,
  Mediano: 27,
  "Taza grande": 36,
};

export const gramosPorTamanoFiltrado: Record<TamanoCafe, number> = {
  Pocillo: 6,
  Mediano: 15,
  "Taza grande": 25,
};

export const precioPorGramo: Record<VariedadCafe, number> = {
  Brasil: 140,
  Colombia: 180,
  "Etiopía": 240,
};

export function calcularPrecioCafe(
  precioBase: number,
  tamano: TamanoCafe,
  variedad: VariedadCafe,
  gramosPorTamano: Record<TamanoCafe, number>,
): number {
  return precioBase + gramosPorTamano[tamano] * precioPorGramo[variedad];
}
