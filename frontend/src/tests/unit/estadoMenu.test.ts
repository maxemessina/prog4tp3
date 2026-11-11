import { describe, expect, it } from "vitest";
import {
  crearEstadoError,
  crearEstadoListo,
  estadoCargando,
} from "../../menu/estadoMenu";

describe("estado del menú", () => {
  it("representa la carga en curso", () => {
    expect(estadoCargando).toEqual({ estado: "cargando" });
  });

  it("representa un error con su mensaje para poder reintentar", () => {
    expect(crearEstadoError("No se pudo cargar el menú")).toEqual({
      estado: "error",
      mensaje: "No se pudo cargar el menú",
    });
  });

  it("representa el menú cargado con los productos", () => {
    const productos = [
      {
        id: 19,
        tipo: "pasteleria" as const,
        nombre: "Muffin de chocolate",
        precio: 2500,
      },
    ];

    expect(crearEstadoListo(productos)).toEqual({
      estado: "listo",
      productos,
    });
  });
});
