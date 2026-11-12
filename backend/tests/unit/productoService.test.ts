
import { describe, expect, it } from "vitest";
import {
  listarProductos,
  obtenerProductoPorId,
} from "../../src/services/productoService";

describe("ProductoService", () => {
  it("devuelve los 20 productos del catálogo", () => {
    const productos = listarProductos();

    expect(productos).toHaveLength(20);

    expect(productos.filter((p) => p.nombre.startsWith("Café expreso"))).toHaveLength(9);
    expect(productos.filter((p) => p.nombre.startsWith("Café filtrado"))).toHaveLength(9);
    expect(productos.filter((p) => p.nombre === "Muffin de chocolate")).toHaveLength(1);
    expect(productos.filter((p) => p.nombre === "Porción de torta selva negra")).toHaveLength(1);
  });

  it("busca un producto por su ID y devuelve undefined si no existe", () => {
    const productos = listarProductos();

    const producto = obtenerProductoPorId(1);
    const inexistente = obtenerProductoPorId(999);

    expect(producto).toBeDefined();
    expect(producto).toEqual(productos[0]);
    expect(inexistente).toBeUndefined();
  });

  it("asigna un ID único a cada producto", () => {
    const productos = listarProductos();

    const ids = productos.map((producto) => producto.id);
    const idsUnicos = new Set(ids);

    expect(idsUnicos.size).toBe(productos.length);
  });

  it("incluye las nueve variantes de café expreso con sus precios correctos", () => {
    const productos = listarProductos();

    const preciosEsperados = [
      5020, 5740, 6820,
      6280, 7360, 8980,
      7540, 8980, 11140,
    ];

    const cafesExpresos = productos.filter((producto) =>
      producto.nombre.startsWith("Café expreso"),
    );

    expect(cafesExpresos.map((producto) => producto.calcularPrecio()))
      .toEqual(preciosEsperados);
  });

  it("incluye las nueve variantes de café filtrado con sus precios correctos", () => {
    const productos = listarProductos();

    const preciosEsperados = [
      4040, 4280, 4640,
      5300, 5900, 6800,
      6700, 7700, 9200,
    ];

    const cafesFiltrados = productos.filter((producto) =>
      producto.nombre.startsWith("Café filtrado"),
    );

    expect(cafesFiltrados.map((producto) => producto.calcularPrecio()))
      .toEqual(preciosEsperados);
  });
});

