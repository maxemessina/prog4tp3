import { describe, expect, it } from "vitest";
import { Muffin } from "../../src/models/Muffin";

describe("Muffin", () => {
  it("calcula el precio del muffin de chocolate", () => {
    const muffin = new Muffin(1);

    expect(muffin.calcularPrecio()).toBe(2500);
  });
});
