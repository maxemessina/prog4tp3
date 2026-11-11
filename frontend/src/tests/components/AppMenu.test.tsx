import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { obtenerProductos } from "../../api/api";
import App from "../../App";

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

describe("App: menú y mesa", () => {
  beforeEach(() => {
    vi.mocked(obtenerProductos).mockReset();
    window.history.replaceState({}, "", "/");
  });

  it("muestra la mesa obtenida de la URL", async () => {
    window.history.replaceState({}, "", "/?mesa=4");
    vi.mocked(obtenerProductos).mockResolvedValue(productos);

    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Mesa 4" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Muffin de chocolate")).toBeInTheDocument();
  });

  it("indica retiro en barra cuando la mesa no es válida", async () => {
    window.history.replaceState({}, "", "/?mesa=abc");
    vi.mocked(obtenerProductos).mockResolvedValue(productos);

    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Retiro en barra" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Muffin de chocolate")).toBeInTheDocument();
  });

  it("muestra un indicador accesible mientras carga el catálogo", () => {
    vi.mocked(obtenerProductos).mockReturnValue(new Promise(() => {}));

    render(<App />);

    expect(screen.getByRole("status")).toHaveTextContent(/cargando menú/i);
  });

  it("muestra el error de API y permite reintentar", async () => {
    vi.mocked(obtenerProductos)
      .mockRejectedValueOnce(new Error("API no disponible"))
      .mockResolvedValueOnce(productos);

    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "API no disponible",
    );
    fireEvent.click(screen.getByRole("button", { name: /reintentar/i }));

    await waitFor(() => {
      expect(screen.getByText("Muffin de chocolate")).toBeInTheDocument();
    });
    expect(obtenerProductos).toHaveBeenCalledTimes(2);
  });
});
