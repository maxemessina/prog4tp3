import { describe, expect, it, vi } from "vitest";
import { Muffin } from "../../src/models/Muffin";
import { TortaSelvaNegra } from "../../src/models/Torta";
import { PedidoService } from "../../src/services/pedidoService";

describe("PedidoService", () => {
  it("crea un pedido con su total calculado", () => {
    const muffin = new Muffin(1);
    const productoService = {
      obtenerProductoPorId: vi.fn().mockReturnValue(muffin),
    };
    const pedidoService = new PedidoService(productoService);

    const pedido = pedidoService.crearPedido([
      { productoId: 1, cantidad: 2 },
    ]);

    expect(pedido).toEqual({
      id: 1,
      items: [{ productoId: 1, cantidad: 2 }],
      estado: "pendiente",
      total: 5000,
    });
  });

  it("lista los pedidos que fueron creados", () => {
    const muffin = new Muffin(1);
    const productoService = {
      obtenerProductoPorId: vi.fn().mockReturnValue(muffin),
    };
    const pedidoService = new PedidoService(productoService);

    pedidoService.crearPedido([{ productoId: 1, cantidad: 1 }]);
    pedidoService.crearPedido([{ productoId: 1, cantidad: 2 }]);

    expect(pedidoService.listarPedidos()).toEqual([
      {
        id: 1,
        items: [{ productoId: 1, cantidad: 1 }],
        estado: "pendiente",
      },
      {
        id: 2,
        items: [{ productoId: 1, cantidad: 2 }],
        estado: "pendiente",
      },
    ]);
  });

  it("obtiene un pedido por su ID y devuelve undefined si no existe", () => {
    const muffin = new Muffin(1);
    const productoService = {
      obtenerProductoPorId: vi.fn().mockReturnValue(muffin),
    };
    const pedidoService = new PedidoService(productoService);

    pedidoService.crearPedido([{ productoId: 1, cantidad: 1 }]);

    expect(pedidoService.obtenerPedidoPorId(1)).toEqual({
      id: 1,
      items: [{ productoId: 1, cantidad: 1 }],
      estado: "pendiente",
      total: 2500,
    });
    expect(pedidoService.obtenerPedidoPorId(2)).toBeUndefined();
  });

  it("conserva la mesa del pedido y reinicia los datos e IDs de prueba", () => {
    const muffin = new Muffin(19);
    const productoService = {
      obtenerProductoPorId: vi.fn().mockReturnValue(muffin),
    };
    const pedidoService = new PedidoService(productoService);

    pedidoService.crearPedido([{ productoId: 19, cantidad: 1 }], 4);
    expect(pedidoService.obtenerPedidoPorId(1)?.mesaId).toBe(4);

    pedidoService.resetear();
    expect(pedidoService.listarPedidos()).toEqual([]);
    expect(
      pedidoService.crearPedido([{ productoId: 19, cantidad: 1 }]).id,
    ).toBe(1);
  });

  it("calcula la facturacion total de los pedidos creados", () => {
    const muffin = new Muffin(1);
    const productoService = {
      obtenerProductoPorId: vi.fn().mockReturnValue(muffin),
    };
    const pedidoService = new PedidoService(productoService);

    pedidoService.crearPedido([{ productoId: 1, cantidad: 2 }]);
    pedidoService.crearPedido([{ productoId: 1, cantidad: 3 }]);

    expect(pedidoService.calcularFacturacionTotal()).toBe(12_500);
  });

  it("calcula las unidades vendidas agrupadas por producto", () => {
    const muffin = new Muffin(1);
    const torta = new TortaSelvaNegra(2);
    const productoService = {
      obtenerProductoPorId: vi.fn((id: number) =>
        id === 1 ? muffin : id === 2 ? torta : undefined,
      ),
    };
    const pedidoService = new PedidoService(productoService);

    pedidoService.crearPedido([
      { productoId: 1, cantidad: 2 },
      { productoId: 2, cantidad: 1 },
    ]);
    pedidoService.crearPedido([
      { productoId: 1, cantidad: 3 },
      { productoId: 2, cantidad: 2 },
    ]);

    expect(pedidoService.calcularUnidadesVendidas()).toEqual({
      "Muffin de chocolate": 5,
      "Porción de torta selva negra": 3,
    });
  });

  it("devuelve el producto con mayor cantidad de unidades vendidas", () => {
    const muffin = new Muffin(1);
    const torta = new TortaSelvaNegra(2);
    const productoService = {
      obtenerProductoPorId: vi.fn((id: number) =>
        id === 1 ? muffin : id === 2 ? torta : undefined,
      ),
    };
    const pedidoService = new PedidoService(productoService);

    pedidoService.crearPedido([
      { productoId: 1, cantidad: 2 },
      { productoId: 2, cantidad: 1 },
    ]);
    pedidoService.crearPedido([
      { productoId: 1, cantidad: 3 },
      { productoId: 2, cantidad: 2 },
    ]);

    expect(pedidoService.obtenerProductoMasVendido()).toEqual({
      producto: "Muffin de chocolate",
      cantidad: 5,
    });
  });

  it("devuelve undefined cuando no hay ventas", () => {
    const productoService = {
      obtenerProductoPorId: vi.fn(),
    };
    const pedidoService = new PedidoService(productoService);

    expect(pedidoService.obtenerProductoMasVendido()).toBeUndefined();
  });
});
