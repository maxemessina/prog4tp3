import { describe, expect, it } from "vitest";
import {
  productoSchema,
  productosSchema,
} from "../../schemas/productoSchema";

const espressoMedianoColombia = {
  id: 5,
  tipo: "expreso",
  nombre: "Café expreso Mediano Colombia",
  tamanio: "Mediano",
  gramosCafe: 27,
  variedad: {
    nombre: "Colombia",
    descripcion:
      "Acidez media, cuerpo equilibrado y notas cítricas y florales",
  },
  precio: 7360,
};

describe("productoSchema", () => {
  it("valida y conserva los datos del café según el contrato de la API", () => {
    expect(productoSchema.parse(espressoMedianoColombia)).toEqual(
      espressoMedianoColombia,
    );
  });

  it("valida un producto de pastelería", () => {
    const muffin = {
      id: 19,
      tipo: "pasteleria",
      nombre: "Muffin de chocolate",
      precio: 2500,
    };

    expect(productoSchema.parse(muffin)).toEqual(muffin);
  });

  it("rechaza cafés sin los datos de variedad requeridos", () => {
    expect(
      productoSchema.safeParse({
        ...espressoMedianoColombia,
        variedad: { nombre: "Colombia" },
      }).success,
    ).toBe(false);
  });

  it("rechaza tipos de producto desconocidos", () => {
    expect(
      productoSchema.safeParse({
        ...espressoMedianoColombia,
        tipo: "bebida",
      }).success,
    ).toBe(false);
  });
});

describe("productosSchema", () => {
  it("valida una lista de productos", () => {
    expect(
      productosSchema.parse([
        espressoMedianoColombia,
        {
          id: 19,
          tipo: "pasteleria",
          nombre: "Muffin de chocolate",
          precio: 2500,
        },
      ]),
    ).toHaveLength(2);
  });

  it("rechaza una lista si contiene al menos un producto inválido", () => {
    expect(
      productosSchema.safeParse([
        espressoMedianoColombia,
        { id: 20, tipo: "pasteleria", nombre: "Torta" },
      ]).success,
    ).toBe(false);
  });
});
