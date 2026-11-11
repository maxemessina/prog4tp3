import { describe, expect, it } from "vitest";
import { TortaSelvaNegra } from "../../src/models/Torta";

describe("TortaSelvaNegra", () => {
  it("calcula el precio de una porcion de torta selva negra", () => {
    const torta = new TortaSelvaNegra(1);

    expect(torta.calcularPrecio()).toBe(4200);
  });
});
