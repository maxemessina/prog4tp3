import { describe, expect, it } from "vitest";
import {
  pedidoSchema,
  pedidoCreadoSchema,
} from "../../schemas/pedidoSchema";

const pedidoCreado = {
  id: 1,
  mesaId: 4,
  items: [{ productoId: 5, cantidad: 2 }],
  estado: "pendiente",
  total: 14720,
};

describe("pedidoSchema", () => {
  it("valida un pedido consultado con sus ítems, mesa y total", () => {
    expect(pedidoSchema.parse(pedidoCreado)).toEqual(pedidoCreado);
  });

  it("acepta pedidos para retirar sin mesa", () => {
    const { mesaId: _mesaId, ...pedidoSinMesa } = pedidoCreado;

    expect(pedidoSchema.parse(pedidoSinMesa)).toEqual(pedidoSinMesa);
  });

  it("rechaza pedidos sin ítems", () => {
    expect(
      pedidoSchema.safeParse({ ...pedidoCreado, items: [] }).success,
    ).toBe(false);
  });

  it("rechaza cantidades que no sean enteros positivos", () => {
    expect(
      pedidoSchema.safeParse({
        ...pedidoCreado,
        items: [{ productoId: 5, cantidad: 0 }],
      }).success,
    ).toBe(false);
  });
});

describe("pedidoCreadoSchema", () => {
  it("valida el pedido devuelto al confirmar una orden", () => {
    expect(pedidoCreadoSchema.parse(pedidoCreado)).toEqual(pedidoCreado);
  });
});
