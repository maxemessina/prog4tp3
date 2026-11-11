import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { obtenerProductos } from "../../api/api";
import { useMenu } from "../../menu/useMenu";

vi.mock("../../api/api", () => ({
  obtenerProductos: vi.fn(),
}));

const productos = [
  {
    id: 19,
    tipo: "pasteleria" as const,
    nombre: "Muffin de chocolate",
    precio: 2500,
  },
];

describe("useMenu", () => {
  beforeEach(() => {
    vi.mocked(obtenerProductos).mockReset();
  });

  it("expone cargando y después el catálogo recibido de la API", async () => {
    let resolver: ((value: typeof productos) => void) | undefined;
    vi.mocked(obtenerProductos).mockReturnValue(
      new Promise((resolve) => {
        resolver = resolve;
      }),
    );

    const { result } = renderHook(() => useMenu());
    expect(result.current.estado).toEqual({ estado: "cargando" });

    await act(async () => {
      resolver?.(productos);
    });

    await waitFor(() => {
      expect(result.current.estado).toEqual({
        estado: "listo",
        productos,
      });
    });
  });

  it("muestra el error de API y permite reintentar la carga", async () => {
    vi.mocked(obtenerProductos)
      .mockRejectedValueOnce(new Error("API no disponible"))
      .mockResolvedValueOnce(productos);

    const { result } = renderHook(() => useMenu());
    await waitFor(() => {
      expect(result.current.estado).toEqual({
        estado: "error",
        mensaje: "API no disponible",
      });
    });

    act(() => {
      result.current.reintentar();
    });

    await waitFor(() => {
      expect(result.current.estado).toEqual({
        estado: "listo",
        productos,
      });
    });
    expect(obtenerProductos).toHaveBeenCalledTimes(2);
  });
});
