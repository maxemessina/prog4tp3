
import { describe, expect, it, vi } from "vitest";
import { confirmarPedido } from "../../pedidos/confirmarPedido";
import { crearControladorConfirmacion } from "../../pedidos/controladorConfirmacion";

describe("confirmarPedido", () => {

  it("vacía el carrito únicamente cuando la API confirma el pedido", async () => {
    const items = [
      { productoId: 5, cantidad: 2 },
    ];

    const pedidoCreado = {
      id: 3,
      mesaId: 4,
      items,
      estado: "pendiente",
      total: 14720,
    };

    const crearPedido = vi.fn().mockResolvedValue(pedidoCreado);
    const vaciarCarrito = vi.fn();

    const resultado = await confirmarPedido(
      4,
      items,
      crearPedido,
      vaciarCarrito,
    );

    expect(crearPedido).toHaveBeenCalledWith(4, items);
    expect(vaciarCarrito).toHaveBeenCalledOnce();
    expect(resultado).toEqual(pedidoCreado);
  });

  it("conserva el carrito cuando la API rechaza el pedido", async () => {
    const items = [
      { productoId: 5, cantidad: 2 },
    ];

    const crearPedido = vi.fn().mockRejectedValue(
      new Error("No se pudo confirmar el pedido"),
    );

    const vaciarCarrito = vi.fn();

    await expect(
      confirmarPedido(4, items, crearPedido, vaciarCarrito),
    ).rejects.toThrow("No se pudo confirmar el pedido");

    expect(crearPedido).toHaveBeenCalledWith(4, items);
    expect(vaciarCarrito).not.toHaveBeenCalled();
  });

  it("evita enviar dos veces un pedido mientras se confirma", async () => {
    const items = [
      { productoId: 5, cantidad: 2 },
    ];

    const pedidoCreado = {
      id: 3,
      mesaId: 4,
      items,
      estado: "pendiente",
      total: 14720,
    };

    let resolverPedido!: (pedido: typeof pedidoCreado) => void;

    const crearPedido = vi.fn().mockImplementation(
      () => new Promise<typeof pedidoCreado>((resolve) => {
        resolverPedido = resolve;
      }),
    );

    const vaciarCarrito = vi.fn();

    const controlador = crearControladorConfirmacion(
      crearPedido,
      vaciarCarrito,
    );

    const primeraConfirmacion = controlador.confirmar(4, items);
    const segundaConfirmacion = controlador.confirmar(4, items);

    expect(crearPedido).toHaveBeenCalledTimes(1);

    resolverPedido(pedidoCreado);

    await expect(primeraConfirmacion).resolves.toEqual(pedidoCreado);
    await expect(segundaConfirmacion).resolves.toEqual(pedidoCreado);

    expect(vaciarCarrito).toHaveBeenCalledOnce();
  });

  it("permite reintentar la confirmación después de un error", async () => {
    const items = [
      { productoId: 5, cantidad: 2 },
    ];

    const pedidoCreado = {
      id: 3,
      mesaId: 4,
      items,
      estado: "pendiente",
      total: 14720,
    };

    const crearPedido = vi.fn()
      .mockRejectedValueOnce(
        new Error("Error temporal del servidor"),
      )
      .mockResolvedValueOnce(pedidoCreado);

    const vaciarCarrito = vi.fn();

    const controlador = crearControladorConfirmacion(
      crearPedido,
      vaciarCarrito,
    );

    await expect(
      controlador.confirmar(4, items),
    ).rejects.toThrow("Error temporal del servidor");

    expect(vaciarCarrito).not.toHaveBeenCalled();

    const resultado = await controlador.confirmar(4, items);

    expect(crearPedido).toHaveBeenCalledTimes(2);
    expect(vaciarCarrito).toHaveBeenCalledOnce();
    expect(resultado).toEqual(pedidoCreado);
  });

});
