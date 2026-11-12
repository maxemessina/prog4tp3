import { describe, expect, it } from "vitest";
import { carritoInicial, carritoReducer } from "../../reducers/carritoReducer";

describe("carritoReducer", () => {
  it("inicia con el carrito vacío", () => {
    expect(carritoInicial).toEqual([]);
  });
});