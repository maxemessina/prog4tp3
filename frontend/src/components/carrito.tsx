
import { useCarrito } from "../context/carritoContext";
import { formatearPrecio } from "../dominio/formatearPrecio";

export function Carrito() {
  const {
    carrito,
    subtotal,
    sumarProducto,
    restarProducto,
    quitarProducto,
  } = useCarrito();

  if (carrito.length === 0) {
    return (
      <section>
        <h2>Carrito</h2>
        <p>El carrito está vacío</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Carrito</h2>

      {carrito.map((item) => (
        <article key={item.producto.id}>
          <h3>{item.producto.nombre}</h3>

          <p>Cantidad: {item.cantidad}</p>

          <p>
            Subtotal:{" "}
            {formatearPrecio(
              item.producto.precio * item.cantidad,
            )}
          </p>

          <button
            type="button"
            aria-label={`Aumentar cantidad de ${item.producto.nombre}`}
            onClick={() => sumarProducto(item.producto.id)}
          >
            +
          </button>

          <button
            type="button"
            aria-label={`Disminuir cantidad de ${item.producto.nombre}`}
            onClick={() => restarProducto(item.producto.id)}
          >
            -
          </button>

          <button
            type="button"
            aria-label={`Quitar ${item.producto.nombre}`}
            onClick={() => quitarProducto(item.producto.id)}
          >
            Quitar
          </button>
        </article>
      ))}

      <h3>Total: {formatearPrecio(subtotal)}</h3>
    </section>
  );
}
