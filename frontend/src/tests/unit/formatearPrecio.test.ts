import { describe, expect, it } from "vitest";
import { formatearPrecio } from "../../dominio/formatearPrecio";

describe("formatearPrecio", () => {
  it("formatea precios en pesos argentinos sin decimales", () => {
    const precioFormateado = formatearPrecio(7360);

    expect(precioFormateado).toContain("$");
    expect(precioFormateado).toContain("7.360");
    expect(precioFormateado).not.toContain(",00");
  });

  it("formatea cero", () => {
    expect(formatearPrecio(0)).toContain("0");
  });
});
