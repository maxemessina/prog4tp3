import { describe, expect, it } from "vitest";
import { leerMesaDesdeBusqueda } from "../../dominio/mesa";

describe("leerMesaDesdeBusqueda", () => {
  it("lee el número de mesa de la query", () => {
    expect(leerMesaDesdeBusqueda("?mesa=4")).toBe(4);
  });

  it.each(["", "?otra=4", "?mesa=", "?mesa=0", "?mesa=-2", "?mesa=abc"])(
    "devuelve undefined si la mesa está ausente o es inválida: %s",
    (busqueda) => {
      expect(leerMesaDesdeBusqueda(busqueda)).toBeUndefined();
    },
  );

  it("rechaza una query ambigua con más de una mesa", () => {
    expect(leerMesaDesdeBusqueda("?mesa=4&mesa=5")).toBeUndefined();
  });
});
