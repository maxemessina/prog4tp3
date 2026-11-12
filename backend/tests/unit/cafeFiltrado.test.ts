import { describe, expect, it } from "vitest";
import { CafeFiltrado } from "../../src/models/CafeFiltrado";

describe("CafeFiltrado", () => {
  it("calcula el precio de un cafe filtrado grande de Etiopia", () => {
    const cafe = new CafeFiltrado(1, "Taza grande", "Etiopía");

    expect(cafe.calcularPrecio()).toBe(9200);
  });
});