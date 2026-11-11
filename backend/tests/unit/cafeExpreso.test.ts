import { describe, expect, it } from "vitest";
import { CafeExpreso } from "../../src/models/CafeExpreso";

describe("CafeExpreso", () => {
  it("calcula el precio de un cafe mediano de Colombia", () => {
    const cafe = new CafeExpreso(1, "Mediano", "Colombia");

    expect(cafe.calcularPrecio()).toBe(7360);
  });
});
