
import { describe, expect, it } from "vitest";
import { buscarCafe } from "../../dominio/buscarCafe";
import type { Cafe } from "../../schemas/productoSchema";

const cafes: Cafe[] = [
  {
    id: 1,
    tipo: "expreso",
    nombre: "Café expreso Mediano Colombia",
    tamanio: "Mediano",
    gramosCafe: 27,
    variedad: {
      nombre: "Colombia",
      descripcion: "Acidez media, cuerpo equilibrado y notas cítricas y florales",
    },
    precio: 7360,
  },
  {
    id: 2,
    tipo: "filtrado",
    nombre: "Café filtrado Mediano Colombia",
    tamanio: "Mediano",
    gramosCafe: 15,
    variedad: {
      nombre: "Colombia",
      descripcion: "Acidez media, cuerpo equilibrado y notas cítricas y florales",
    },
    precio: 5900,
  },
];

describe("buscarCafe", () => {
  it("encuentra el café que coincide con las tres selecciones", () => {
    const resultado = buscarCafe(
      cafes,
      "expreso",
      "Mediano",
      "Colombia",
    );

    expect(resultado).toEqual(cafes[0]);
  });

  it("devuelve undefined cuando no existe la combinación seleccionada", () => {
    const resultado = buscarCafe(
      cafes,
      "expreso",
      "Pocillo",
      "Brasil",
    );

    expect(resultado).toBeUndefined();
  });
});
